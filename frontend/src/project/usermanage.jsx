import React, { useContext, useState,useEffect } from "react";
import { Mycontext } from "./Newcont";
import { Link, useNavigate } from 'react-router-dom';
import Adminnav from './adminnav';
import './nav.css';
import axios from 'axios'



function Usermanage() {
  const { ban, setban } = useContext(Mycontext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4400/api/admin/login/get")
      .then(response => {
        console.log("all users", response.data);
        setUsers(response.data.allUsers);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);


  
  const DeleteUser = async (id) => {
    const shouldRemove = window.confirm("Are you sure?");
    if (shouldRemove) {
      try {
        await axios.get(`http://localhost:4400/api/admin/login/delete/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const banUser = async (id) => {
    const shouldBan = window.confirm("Are you sure?");
    if (shouldBan) {
      try {
        await axios.post(`http://localhost:4400/api/admin/login/ban/${id}`);
        setban([...ban, id]); 
        setUsers(users.map(user => user._id === id ? {...user, isBanned: true} : user)); 
      } catch (error) {
        console.error('Error banning user:', error);
      }
    }
  };

  const unbanUser = async (id) => {
    const shouldUnban = window.confirm("Are you sure?");
    if (shouldUnban) {
      try {
        await axios.get(`http://localhost:4400/api/admin/login/unban/${id}`);
        setban(ban.filter((bannedId) => bannedId !== id)); 
        setUsers(users.map(user => user._id === id ? {...user, isBanned: false} : user)); 
      } catch (error) {
        console.error('Error unbanning user:', error);
      }
    }
  };

  return (
    <>
      <Adminnav />
      <div className="user-outer">
        <center>
          <table>
            {users.map((user) => (
              <tr key={user._id} className="data-yet">
                <th>email: {user.email}</th>
                <td>
                  <button onClick={() => DeleteUser(user._id)}>
                    Delete User
                  </button>
                </td>
                <td>
                  {user.isBanned ? (
                    <button onClick={() => unbanUser(user._id)}>Unban</button>
                  ) : (
                    <button onClick={() => banUser(user._id)}>Ban</button>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </center>
      </div>
    </>
  );
}

export default Usermanage;
