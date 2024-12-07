import React from 'react';
import './about_styles.css'; 
// import './font-awesome.min.css'; 

const TeamMember = ({ imgSrc, name, designation, about, linkedin }) => {
  return (
    <div className="teams">
      <img src={imgSrc} alt={name} />
      <div className="name">{name}</div>
      <div className="desig">{designation}</div>
      <div className="about">{about}</div>

      <div className="social-links">
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          <i className="fa fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
};

const OurTeam = () => {
  return (
    <div className="containerAbout">
      <div className="header">
        <h1>Our Team</h1>
      </div>
      <div className="sub-container">
        <TeamMember
          imgSrc="https://i.imgur.com/ZhYab9b.jpg"
          name="Abhishek Jhanji"
          designation="Developer"
          about="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum labore quam reprehenderit vitae aliquam dicta!"
          linkedin="https://www.linkedin.com/in/abhishek-jhanji-73622318b/"
        />

        <TeamMember
          imgSrc="svg/profile1.svg"
          name="Md Khaja Ghouse Mohiuddin"
          designation="Developer"
          about="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum labore quam reprehenderit vitae aliquam dicta!"
          linkedin="https://www.linkedin.com/in/khaja-ghouse-mohammed/"
        />

        <TeamMember
          imgSrc="svg/profile2.svg"
          name="Narender Singh"
          designation="Developer"
          about="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum labore quam reprehenderit vitae aliquam dicta!"
          linkedin="www.linkedin.com/in/narender-singh-a98000167"
        />

        <TeamMember
          imgSrc="svg/profile3.svg"
          name="Niraj Gupta"
          designation="Developer"
          about="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum labore quam reprehenderit vitae aliquam dicta!"
          linkedin="https://www.linkedin.com/in/niraj-gupta-9313b81b1/"
        />
      </div>
    </div>
  );
};

export default OurTeam;