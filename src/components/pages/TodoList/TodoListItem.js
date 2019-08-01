import React from "react";
import { Link } from "react-router-dom";

const TodoListItem = (props) => (
    <tr>
        <th scope="row">#{props.itemId}</th>
        <td>{props.itemName}</td>
        <td>{props.itemOwner}</td>
        <td>{(props.status === "Active") ? <p className="text-success">Active</p> : <p className="text-danger">Inactive</p>}</td>
        <td>
            <ul className="list-inline">
                <li className="list-inline-item text-center"><Link to={"/TodoList/Get/" + props.itemId}>View</Link></li>
                <li className="list-inline-item text-center"><Link to={"/TodoList/Update/" + props.itemId}>Update</Link></li>
                <li className="list-inline-item text-center"><Link to={"/TodoList/Delete/" + props.itemId}>Delete</Link></li>
            </ul>
        </td>
    </tr>
);

export default TodoListItem;