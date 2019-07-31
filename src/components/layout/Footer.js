import React from "react";

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <span className="copyright text-muted"> &copy; Todo List App {new Date().getFullYear()} Designed by <a href="https://github.com/camelkyhn">CamelKyhn</a></span>
        </div>
    </footer>
);

export default Footer;