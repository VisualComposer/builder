import React from 'react'
import styled from 'styled-components'

const UserCheckBox = styled.input`
    display: inline-block !important;
    width: 15px !important;
    height: 15px !important;
    // margin-bottom: -4px !important;
    margin-right: 5px !important;
    margin-left: 0 !important;
    border-radius: 3px !important;
    border: 2px solid #363d4d !important;
    font-family: 'Roboto' !important;
    opacity: 1 !important;
    transition: all .12s, border-color .08s !important;
    box-sizing: content-box !important;
    border-color: #7c6df4!important;
    &:checked:before {
      content: '' !important;
      display: block;
      position: absolute;
      width: 3px !important;
      height: 7px !important;
      margin: 0.1rem 0 0 -0.125rem !important;
      border: solid #363d4d;
      border-width: 0 2.5px 2.5px 0;
      transform: rotate(45deg);
      box-sizing: content-box;
      border-color: #FFFFFF !important;
  }
  &:checked {
    background-color: #7c6df4!important;
    opacity: 1!important;
    color: #fff!important;
    border-color: #7c6df4!important;
  }
`

export default function UserTab (props) {
  const {
    notifyUser,
  } = props
  const [userList, setUserList] = React.useState(notifyUser)
  const handleChangeUser = (value) => {
    const newUsers = userList.map(each =>
      each.value === value
        ? { ...each, checked: !each.checked } : each
    )
    setUserList(newUsers)
  }
  return (
    <>
      {
        userList.map(user => (
          <div key={user.value}
            style={{ paddingBottom: '5px' }}
          >
            <UserCheckBox
              type="checkbox"
              id={user.value}
              defaultChecked = {user.checked}
              onChange= {() => handleChangeUser(user.value)}
            />
            <label
              htmlFor= {user.value}
            >
              {user?.label.split(' ')[0]}
            </label>
          </div>
        ))
      }
    </>
  )
}
