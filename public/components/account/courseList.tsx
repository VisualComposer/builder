import React from 'react'

interface Props {
    list: [{
        img: string;
        title: string;
        duration: string;
    }];
    url: string;
}

const CourseList: React.FC<Props> = ({list, url}) => {
  return (
    <div className='vcv-course-list'>
      {
        list.map((item, index) =>
          <a href={url} key={`course-${index}`} className="vcv-course-item">
            <img src={item.img} alt="" className="vcv-course-image"/>
            <div className='vcv-course-text'>
                <p className="vcv-course-title">{item.title}</p>
                <p className="vcv-course-duration">{item.duration}</p>
            </div>
          </a>
        )
      }
      <a href={url} className='vcv-course-button'>
       View full course (4 videos)
      </a>
    </div>
  )
}

export default CourseList
