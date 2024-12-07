from rest_framework import generics
from .models import Pose
from .serializers import PoseSerializer

from django.http import JsonResponse,HttpResponse,FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST,require_GET
import cv2
import mediapipe as mp
import math
import numpy as np
import imageio
import base64
from PIL import Image
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

pose_slangs={
    (23,25,27): 'Hip-Knee Angle',
    (24,26,28): 'Hip-Knee Angle',
    (11,23,25): 'Shoulder-Waist-Knee Angle',
    (25,23,24): 'Hip- Knee Angle',
    (11,12,14): 'Across-Shoulder-Elbow Angle',
    (25,24,28): 'Angle between Legs',
    (0,24,28): 'Top-bottom line Angle',
    (24,12,14): 'Elbow-Shoulder-Hip Angle',
    (8,12,14):'Hand -bend Angle',
    (12,24,28):'Shoulder-Hip-Toe Angle',
    (26,28,32):'Knee-Toe-Angle Angle',
    (12,24,26):'Shoulder-Hip-Knee Angle',
    (14,12,24):'Elbow-Shoulder-Hip Angle',
    (15,13,11):'Hand-Bend Angle',
    (24,23,25):'Waist-Leg Angle',
    (7,11,13):'Hand-Bend Angle',
    (23,11,13):'Elbow-Shoulder-Hip Angle',
    (23,11,7):'Top-Elbow-Hip Angle',
    (12,14,16):'Hand-Bend Angle',
    (8,24,26):'Top-Waist-Knee Angle',
    (11,13,15):'Hand-Bend Angle',
    (12,23,25):'Cross Shoulder-Waist-Knee Angle',
    (26,24,23):'Waist Leg Angle',
    (11,24,26):'Cross Shoulder-Waist-Knee Angle'
}

all_poses={
    'Squat Angle': [[(23, 25, 27), (24, 26, 28),(11,23,25),(25,23,24)], [(80,110), (90,110),(90,120),(160,170)]],
    'Side Leg Lift': [[(11,23,25),(11,12,14),(25,24,28),(0,24,28),(24,12,14)], [(105,115),(120,130),(45,55),(130,140),(55,75)]],
    'Push Ups': [[(26,28,32),(12,24,26),(14,12,24)], [(95,105),(165,175),(40,50)]],
    'V-Sits': [[(8,12,14),(12,24,26)], [(80,100),(45,65)]],
    'Warrior': [[(24,26,28),(11,23,25),(24,23,25)], [(100,115),(135,145),(150,160)]],
    'Side Leg Lunges': [[(24, 26, 28),(7,11,13),(24, 23, 25),(12,23,25)], [(95,110),(125,140),(140,150),(160,175)]],
    'Knee Squeeze': [[(23,25,27),(23,11,13),(23,11,7)], [(70,80),(30,40),(135,145)]],
    'Lunges': [[(12,24,26),(24,26,28),(24,23,25)], [(100,110),(80,100),(100,110)]],
    'Straight': [[(12,24,26),(12,14,16),(8,24,26),(11,13,15)], [(165,180),(165,180),(170,180),(165,180)]],
    'TreePose': [[(11,23,25),(12,24,26),(12,14,16)], [(120,130),(170,190),(40,50)]],
    'Warrior-O':[[(23,25,27),(12,24,26),(26,24,23)], [(100,115),(135,145),(150,160)]],
    'Lunges-O':[[(11,23,25),(23,25,27),(26,24,23)],[(100,110),(80,100),(100,110)]],
    'TreePose-O':[[(12,24,26),(11,23,25),(11,13,15)],[(120,130),(170,190),(40,50)]],
    'Side Leg Lunges-O':[[(23,25,27),(8,12,14),(26,24,23),(11,24,26)], [(95,110),(125,140),(140,150),(160,175)]],
    'V-Sits-O':[[(7,11,13),(11,23,25)],[(80,100),(45,65)]]
    
}

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def calculate_angle(a, b, c):
    angle_radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
    angle_degrees = math.degrees(angle_radians)
    if angle_degrees<=180:
        return angle_degrees
    else:
        return 360-angle_degrees

def calculate_angle(a, b, c):
    angle_radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
    angle_degrees = math.degrees(angle_radians)
    if angle_degrees<=180:
        return angle_degrees
    else:
        return 360-angle_degrees

def visualize_angles(image, landmarks, angles_info):
    for info in angles_info:
        for points_set in info['points']:
            point1, point2, point3 = points_set
            angle = calculate_angle(landmarks[point1], landmarks[point2], landmarks[point3])
            
            cv2.line(image, landmarks[point1], landmarks[point2], (0, 0, 255), 2)
            cv2.line(image, landmarks[point2], landmarks[point3], (0, 0, 255), 2)
            center = landmarks[point2]
            axes_x = axes_y = int(abs(angle) / 10) + 10  
            angle_start = int(math.degrees(math.atan2(landmarks[point1][1] - center[1], landmarks[point1][0] - center[0])))
            angle_end = int(math.degrees(math.atan2(landmarks[point3][1] - center[1], landmarks[point3][0] - center[0])))
            
            complementary_start = (angle_start + 180) % 360
            complementary_end = (angle_end + 180) % 360
            
            if angle > 180:
                angle_start, angle_end = complementary_start, complementary_end
                angle = 360 - angle
            
            min_x, min_y = min(landmarks[point1][0], landmarks[point2][0], landmarks[point3][0]), min(landmarks[point1][1], landmarks[point2][1], landmarks[point3][1])
            max_x, max_y = max(landmarks[point1][0], landmarks[point2][0], landmarks[point3][0]), max(landmarks[point1][1], landmarks[point2][1], landmarks[point3][1])
            
            center = (max(min(center[0], max_x), min_x), max(min(center[1], max_y), min_y))
            
            if abs(angle_start - angle_end) <= 180:
                cv2.ellipse(image, center, (axes_x, axes_y), 0, angle_start, angle_end, (0, 0, 255), 2)
            else:
                cv2.ellipse(image, center, (axes_x, axes_y), 0, complementary_start, complementary_end, (0, 0, 255), 2)
            
            cv2.putText(image, f"{info['name']}: {angle:.2f} degrees",
                        (landmarks[point2][0], landmarks[point2][1] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

def distance_between_points(p1, p2):
    return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)

def check_error(exercise,angles_list):
    list_angles_taken=all_poses[exercise][0]
    true_range_for_angles=all_poses[exercise][1]
    error_mat=[]
    error_disp=[]
    
    for i in range(len(list_angles_taken)):
        if angles_list[i]>=true_range_for_angles[i][0] and angles_list[i]<=true_range_for_angles[i][1]:
            error_mat.append(0)
            error_disp.append(0)
        else:
           
            if angles_list[i]>true_range_for_angles[i][1]:
                diff=abs(angles_list[i]-true_range_for_angles[i][1])
                error_mat.append(diff)
                error_disp.append(-1*diff)
            else:
                diff=abs(angles_list[i]-true_range_for_angles[i][0])
                error_mat.append(diff)
                error_disp.append(diff)    
    return_dict={}            
    for i in range(len(list_angles_taken)):
        return_dict[pose_slangs[list_angles_taken[i]]]=error_disp[i]
    return return_dict    

def check_pose(pose_landmarks):
    e_dict={}
    angles_info = [
      
        {'points': [(23, 25, 27), (24, 26, 28),(11,23,25),(25,23,24)], 'name': 'Squat Angle', 'range': [(80,130), (80,130),(90,120),(150,180)]},
        {'points': [(11,23,25),(11,12,14),(25,24,28),(0,24,28),(24,12,14)], 'name': 'Side Leg Lift', 'range': [(100,130),(100,140),(30,60),(120,150),(55,75)]},
        {'points': [(26,28,32),(12,24,26),(14,12,24)], 'name': 'Push Ups', 'range': [(80,110),(150,180),(30,60)]},
        {'points': [(8,12,14),(12,24,26)], 'name': 'V-Sits', 'range': [(80,100),(30,80)]},
        {'points': [(24,26,28),(11,23,25),(24,23,25)], 'name': 'Warrior', 'range': [(90,120),(120,150),(140,170)]},
        {'points': [(24, 26, 28),(7,11,13),(24, 23, 25),(12,23,25)], 'name': 'Side Leg Lunges', 'range': [(80,150),(110,150),(120,160),(140,180)]},
        {'points': [(23,25,27),(23,11,13),(23,11,7)], 'name': 'Knee Squeeze', 'range': [(60,90),(20,50),(120,150)]},
        {'points': [(12,24,26),(24,26,28),(24,23,25)], 'name': 'Lunges', 'range': [(90,120),(80,100),(90,120)]},
        {'points': [(12,24,26),(12,14,16),(8,24,26),(11,13,15)], 'name': 'Straight', 'range': [(165,180),(165,180),(170,180),(165,180)]},
        {'points': [(11,23,25),(12,24,26),(12,14,16)], 'name': 'TreePose', 'range': [(100,140),(170,190),(30,60)]},
        
        {'points': [(23,25,27),(12,24,26),(26,24,23)], 'name': 'Warrior-O', 'range': [(90,120),(120,150),(140,170)]},
        {'points': [(11,23,25),(23,25,27),(26,24,23)], 'name': 'Lunges-O', 'range': [(90,120),(80,100),(90,120)]},
        {'points': [(12,24,26),(11,23,25),(11,13,15)], 'name': 'TreePose-O', 'range': [(100,140),(170,190),(30,60)]},
        {'points': [(23,25,27),(8,12,14),(26,24,23),(11,24,26)], 'name': 'Side Leg Lunges-O', 'range': [(80,150),(110,150),(120,160),(140,180)]},
        {'points': [(7,11,13),(11,23,25)], 'name': 'V-Sits-O', 'range': [(80,100),(30,80)]},
        
    ]

    for info in angles_info:
        exercise_name = info['name']
        angles_list=[]
        angle_ranges=[]
        till=0
        for i, points_set in enumerate(info['points']):
            till=len(info['points'])
            point1, point2, point3 = points_set
            angle = calculate_angle(pose_landmarks[point1], pose_landmarks[point2], pose_landmarks[point3])
            angle_range = info['range'][i]
            angles_list.append(angle)
            angle_ranges.append(angle_range)
        
        i=0
        flag=1
        while(i<till):
            
            if angles_list[i]>=angle_ranges[i][0] and angles_list[i]<=angle_ranges[i][1]:
                i+=1
                continue
            else:
                flag=0
                break
        if flag==1:
            # visualize_angles(image, pose_landmarks, [info])
            e_dict = check_error(exercise_name,angles_list)
            return exercise_name,e_dict
        
                
    return "Unknown Exercise",e_dict

@csrf_exempt
@require_POST
def pose_estimation_image(request):
    if 'image' not in request.FILES:
        return JsonResponse({'error': 'Image file not found'}, status=400)
    detected_pose = "Unknown Exercise"

    image_file = request.FILES['image']
    image_bytes = image_file.read()
    image_np = np.array(Image.open(BytesIO(image_bytes)))

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        err_dict={}
        if results.pose_landmarks:
            pose_landmarks = {i: (int(l.x * image_np.shape[1]), int(l.y * image_np.shape[0])) for i, l in enumerate(results.pose_landmarks.landmark)}
            detected_pose,err_dict = check_pose(pose_landmarks)
            image_np = draw_pose_text(image_np, detected_pose)

    modified_image = Image.fromarray(image_np)
    modified_image_bytes = BytesIO()
    modified_image.save(modified_image_bytes, format='JPEG')
    modified_image_base64 = base64.b64encode(modified_image_bytes.getvalue()).decode('utf-8')

    response_data = {
        'detected_pose': detected_pose,
        'modified_image': modified_image_base64,
        'error_dict': err_dict
    }
    

    return JsonResponse(response_data)

def draw_pose_text(frame, detected_pose):
    # font = cv2.FONT_HERSHEY_SIMPLEX
    font = cv2.FONT_HERSHEY_DUPLEX
    cv2.putText(frame, f'Detected Pose: {detected_pose}', (50, 50), font, 1.5, (0, 0, 0), 2)
    return frame

@csrf_exempt
@require_POST
def pose_estimation_video(request):
    if 'video' not in request.FILES:
        return JsonResponse({'error': 'Video file not found'}, status=400)

    video_file = request.FILES['video']
    video_path = 'temp_video.mp4'
    with open(video_path, 'wb') as f:
        f.write(video_file.read())

    cap = cv2.VideoCapture(video_path)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        size = (int(cap.get(3)), int(cap.get(4)))

        out_path = 'output_video.mp4'
        out = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, size)

        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)

            if results.pose_landmarks:
                pose_landmarks = {i: (int(l.x * frame.shape[1]), int(l.y * frame.shape[0])) for i, l in enumerate(results.pose_landmarks.landmark)}
                detected_pose = check_pose(pose_landmarks)
                frame = draw_pose_text(frame, detected_pose)

            out.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
            

        cap.release()
        out.release()

    cv2.destroyAllWindows()

    # response = HttpResponse(content_type='video/mp4')
    # response['Content-Disposition'] = 'attachment; filename=output_video.mp4'
    # with open(out_path, 'rb') as f:
    #     response.write(f.read())

    # return response
    return FileResponse(open(out_path, 'rb'), content_type='video/mp4')


class PoseListCreateView(generics.ListCreateAPIView):
    queryset = Pose.objects.all()
    serializer_class = PoseSerializer

# class HomeView(APIView):
#     permission_classes = (IsAuthenticated, )
#     def get(self, request):
#         content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
#         return Response(content)

  
class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)
          

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')

    if not email or not username or not password:
        return JsonResponse({'error': 'Email, username, and password are required'}, status=400)

    user = User.objects.create_user(email=email, username=username, password=password)
    refresh = RefreshToken.for_user(user)

    response_data = {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

    return JsonResponse(response_data, status=201)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
        return JsonResponse(response_data, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
