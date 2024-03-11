import React, {useState, useEffect} from 'react'
import {Navigate} from 'react-router-dom'
import {UserAuth} from '../context/AuthContext'
import ReactSearchBox from "react-search-box";
import PromoteAdmin from '../components/promoteadmin'

const PromoteUser = () => {
    const [banneddata, setBannedData] = useState([]);
    const [bannedselect, setBannedSelect] = useState();
    const [bannedbutton, setBannedButton] = useState(false);

    const {user} = UserAuth();
    const current_user = user.email;
    const [isuserowner, setIsUserOwner] = useState(false);

    const fetchBannedEmails = async () => {
        try {
            const response = await fetch('http://localhost:4000/fetchrole?roleName=Banned');
            const [bannedRole] = await response.json();

            if(bannedRole)
            {
                const bannedEmails = bannedRole.Roles.map(member => ({
                    key: member.Userid,
                    value: member.Emails, //double check if this is fine with multiple in a list
                }));
                setBannedData(bannedEmails);
            }
        } catch (error) {
            console.error('Failed to fetch ban list', error);
        }
    };

    const handleUnbannedUser = async () => {
        if(!bannedselect)
            return;
        const ObjectId = bannedselect.item.key;
        const ObjectEmail = bannedselect.item.value;

        const userId = ObjectId[0];
        const userEmail = ObjectEmail[0];

        try {
            const response = await fetch('http://localhost:4000/unbanuser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, userEmail }),
            });

            const data = await response.json();
            console.log(data.message);

        } catch (error) {
            console.error('Failed to unban user', error);
        }

        setBannedButton(false);
    }

    const handleSelect = (record) => {
        console.log(record);
        setBannedSelect(record);
        setBannedButton(true);
    }

    const checkMembersInRole = (role, userEmail)  => {
        //console.log(role);
        //console.log(userEmail);
       return fetch(`http://localhost:4000/findmember?role=${encodeURIComponent(role)}&current_user=${encodeURIComponent(userEmail)}`)
            .then(response => response.json())
            .then(data=> {
                console.log(data.message);
                return data.message.includes("Member exists in role");
            })
            .catch(error => {
                console.error('Error', error);
                return false;
            });
    }

    const fetchOwnerRole = async () => {
        
        try {
            const isOwner = await checkMembersInRole('Owner', current_user);
            if(isOwner) {
                console.log("The user is a member of owner")
                setIsUserOwner(true);
            }
            else {
                console.log("The user is not any role yet")
            }
        } catch (error) {
            console.error("Error Fetching DA Role", error);
        }
    }

    useEffect(() => {
        fetchBannedEmails();
        fetchOwnerRole();
        
    }, [])

    return(
        <div>
            <br />
            <p>Banned Users</p>
            <ReactSearchBox
                placeholder='Promote User'
                value = "Doe"
                data = {banneddata}
                onSelect={handleSelect}
            />
            {bannedselect && bannedbutton && (
                <div className="promote">
                    <p>Unban {bannedselect.item.value}?</p> 
                    <button onClick={handleUnbannedUser}>Unban User</button>
                    <button onClick={()=>setBannedButton(false)}>No</button>
                </div>
            )}
             {isuserowner && (
                  <PromoteAdmin />
            )}         
        </div>
    )
};

export default PromoteUser;


/* 

        try {
            //Fetching the Guest Role
            const responseGuest = await fetch('http://localhost:3001/Roles?Role=Guest');
            const [guestRole] = await responseGuest.json();
            const updatedGuestMembers = [...guestRole.members, { "aemail": userEmail, "userid": userId}]; 

             //Adding new Member to Guest Role
             await fetch(`http://localhost:3001/Roles/${guestRole.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ members: updatedGuestMembers }),
            });

            //Fetching filtered banned list(without the one moved to banned)
            const responseBanned = await fetch('http://localhost:3001/Roles?Role=Banned');
            const [bannedRole] = await responseBanned.json();
            const filteredBannedMembers = bannedRole.members.filter(member => member.userid !== userId);

            //replacing old banned list with new banned list
            await fetch(`http://localhost:3001/Roles/${bannedRole.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ members: filteredBannedMembers }),
            });
            console.log(`${userEmail} Unbanned.`)
        } catch (error) {
            console.error('Failed to unban user', error);
        }
*/