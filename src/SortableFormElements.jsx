import SortableElement from './SortableElement';
import {
  Header,
  Paragraph,
  Label,
  LineBreak,
  TextInput,
  NumberInput,
  TextArea,
  Dropdown,
  Checkboxes,
  DatePicker,
  TimePicker,
  RadioButtons,
  Image,
  Rating,
  AsyncDropdown,
  UploadFile,
  HyperLink,
  Download,
  Camera,
  Range
} from './FormElements';

const FormElements = {};

FormElements.Header = SortableElement(Header);
FormElements.Paragraph = SortableElement(Paragraph);
FormElements.Label = SortableElement(Label);
FormElements.LineBreak = SortableElement(LineBreak);
FormElements.TextInput = SortableElement(TextInput);
FormElements.NumberInput = SortableElement(NumberInput);
FormElements.TextArea = SortableElement(TextArea);
FormElements.Dropdown = SortableElement(Dropdown);
FormElements.Checkboxes = SortableElement(Checkboxes);
FormElements.DatePicker = SortableElement(DatePicker);
FormElements.TimePicker = SortableElement(TimePicker);
FormElements.RadioButtons = SortableElement(RadioButtons);
FormElements.Image = SortableElement(Image);
FormElements.Rating = SortableElement(Rating);
FormElements.AsyncDropdown = SortableElement(AsyncDropdown);
FormElements.HyperLink = SortableElement(HyperLink);
FormElements.Download = SortableElement(Download);
FormElements.Camera = SortableElement(Camera);
FormElements.UploadFile = SortableElement(UploadFile);
FormElements.Range = Range;

module.exports = FormElements;