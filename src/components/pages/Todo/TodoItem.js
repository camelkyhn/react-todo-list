import React from "react";
import { Link } from "react-router-dom";

const TodoItem = (props) => (
    <tr>
        <th scope="row">#{props.itemId}</th>
        <td>{props.name}</td>
        <td>{props.description}</td>
        <td>{props.deadline.substr(0, props.deadline.indexOf('T'))}</td>
        <td>{props.completed ? <p className="text-success">Completed</p> : <p className="text-secondary">Not Completed</p>}</td>
        <td>{(props.dependentTodo === undefined || props.dependentTodo === null) ? <p className="text-default">None</p> : <p className="text-info">{props.dependentTodo.name}</p>}</td>
        <td>{(props.status === "Active") ? <p className="text-success">Active</p> : <p className="text-danger">Inactive</p>}</td>
        <td>
            <ul className="list-inline">
                <li className="list-inline-item text-center"><Link to={"/Todo/Update/" + props.itemId}>Update</Link></li>
            </ul>
        </td>
    </tr>
);

export default TodoItem;