import React from 'react';

const Dropspot = ({ label, children }) => (
    <fieldset>
        <legend>{label}</legend>
        <div>{children}</div>
    </fieldset>
);

export default Dropspot;
