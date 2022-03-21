import React from 'react'

interface Props {
    list: [{
        img: string;
        title: string;
        duration: string;
    }];
    url: string;
    buttonText: string;
}

const CourseList: React.FC<Props> = ({list, url, buttonText}) => {
  return (
    <div className='vcv-course-list'>
      {
        list.map((item, index) =>
          <a href={url} target='_blank' rel='noopener noreferrer' key={`course-${index}`} className='vcv-course-item'>
            <img src={item.img} alt={item.title} className='vcv-course-image'/>
            <div className='vcv-course-text'>
                <p className='vcv-course-title'>{item.title}</p>
                <p className='vcv-course-duration'>{item.duration}</p>
            </div>
          </a>
        )
      }
      <a href={url} target='_blank' rel='noopener noreferrer' className='vcv-course-button'>
          {buttonText}
      </a>
    </div>
  )
}

export default CourseList
