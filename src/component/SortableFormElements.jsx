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

const SortableFormElements = {};

SortableFormElements.Header = SortableElement(Header);
SortableFormElements.Paragraph = SortableElement(Paragraph);
SortableFormElements.Label = SortableElement(Label);
SortableFormElements.LineBreak = SortableElement(LineBreak);
SortableFormElements.TextInput = SortableElement(TextInput);
SortableFormElements.NumberInput = SortableElement(NumberInput);
SortableFormElements.TextArea = SortableElement(TextArea);
SortableFormElements.Dropdown = SortableElement(Dropdown);
SortableFormElements.Checkboxes = SortableElement(Checkboxes);
SortableFormElements.DatePicker = SortableElement(DatePicker);
SortableFormElements.TimePicker = SortableElement(TimePicker);
SortableFormElements.RadioButtons = SortableElement(RadioButtons);
SortableFormElements.Image = SortableElement(Image);
SortableFormElements.Rating = SortableElement(Rating);
SortableFormElements.AsyncDropdown = SortableElement(AsyncDropdown);
SortableFormElements.HyperLink = SortableElement(HyperLink);
SortableFormElements.Download = SortableElement(Download);
SortableFormElements.Camera = SortableElement(Camera);
SortableFormElements.UploadFile = SortableElement(UploadFile);
SortableFormElements.Range = Range;


export default SortableFormElements;