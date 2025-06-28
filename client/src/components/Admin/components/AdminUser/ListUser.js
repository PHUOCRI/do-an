import React from 'react';
import User from './User';


function ListUser(props) {
    const {users} = props

    return (
        <div className="admin-user-list">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item, index) => (<User user={item} number={index} key={item._id || index}></User>))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;