import React from "react";
import ReactDOM from "react-dom";
import DemoBar from './demobar';
import FormBuilder from "./src/index";
import * as variables from './variables'

// Add our stylesheets for the demo.
require('./public/css/application.css.scss');

ReactDOM.render(
  <FormBuilder.ReactFormBuilder variables={variables}
    url='/api/formdata'
    saveUrl='/api/formdata'
  />,
  document.getElementById('form-builder')
)

ReactDOM.render(
  <DemoBar variables={variables}/>,
  document.getElementById('demo-bar')
)
