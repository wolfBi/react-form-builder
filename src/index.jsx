/**
 * <ReactFormBuilder />
 */

import React from 'react';

import ElementActions from './actions/ElementActions';
import ElementStore from './stores/ElementStore';
import ReactFormGenerator from './ReactFormGenerator';
import ReactFormBuilder from './ReactFormBuilder';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const FormBuilders = {};
FormBuilders.ReactFormBuilder = DragDropContext(HTML5Backend)(ReactFormBuilder);
FormBuilders.ReactFormGenerator = ReactFormGenerator;

module.exports = FormBuilders;

export {ElementStore}
