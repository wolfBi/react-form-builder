/**
 * <ReactFormBuilder />
 */
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactFormGenerator from './ReactFormGenerator';
import ReactFormBuilder from './ReactFormBuilder';

let FormBuilders = {};
FormBuilders.ReactFormBuilder = DragDropContext(HTML5Backend)(ReactFormBuilder);
FormBuilders.ReactFormGenerator = ReactFormGenerator;

export default FormBuilders
