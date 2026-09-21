import Arrow from "./Arrow";
import AdminIcon from "./AdminIcon";
import BellIcon from "./BellIcon";
import CardViewIcon from "./CardViewIcon";
import ClassIcon from "./ClassIcon";
import CloseIcon from "./CloseIcon";
import DoorIcon from "./DoorIcon";
import EditIcon from "./EditIcon";
import EmailIcon from "./contact/EmailIcon";
import ExpandCenterColumnIcon from "./ExpandCenterColumnIcon";
import FilterIcon from "./FilterIcon";
import FrascoFilledIcon from "./FrascoFilledIcon";
import HandleGripIcon from "./HandleGripIcon";
import ListIcon from "./ListIcon";
import MinusIcon from "./MinusIcon";
import NumberAscendingIcon from "./sorts/NumberAscendingIcon";
import NumberDescendingIcon from "./sorts/NumberDescendingIcon";
import PanelToLeftIcon from "./PanelToLeftIcon";
import PersonIcon from "./PersonIcon";
import PinIcon from "./PinIcon";
import CurriculumIcon from "./CurriculumIcon";
import TwoPersonsIcon from "./TwoPersonsIcon";
import ScheduleIcon from "./ScheduleIcon";
import SchoolEmailIcon from "./contact/SchoolEmailIcon";
import SchoolHatIcon from "./SchoolHatIcon";
import SearchIcon from "./SearchIcon";
import SortIcon from "./sorts/SortIcon";
import StatusIcon from "./StatusIcon";
import StickArrowDownIcon from "./StickArrowDownIcon";
import TextAscendingIcon from "./sorts/TextAscendingIcon";
import TextDescendingIcon from "./sorts/TextDescendingIcon";
import ThreeColumnsIcon from "./ThreeColumnsIcon";
import ThreePointMenuIcon from "./ThreePointMenuIcon";
import TildeIcon from "./TildeIcon";
import ToolFillIcon from "./ToolFillIcon";
import ToolOutlineIcon from "./ToolOutlineIcon";
import TriangleArrowIcon from "./TriangleArrowIcon";
import UnvisibleIcon from "./UnvisibleIcon";
import VisibleIcon from "./VisibleIcon";
import WhatsAppIcon from "./contact/WhatsAppIcon";
import ZoomInIcon from "./ZoomInIcon";
import ZoomOutIcon from "./ZoomOutIcon";
import PlusIcon from "./PlusIcon";
import ProgressIcon from "./ProgressIcon";
import BookIcon from "./BookIcon";
import HashmarkIcon from "./HashmarkIcon";
import FrascoOutlineIcon from "./FrascoOutlineIcon";
import FailedClassIcon from "./FailedClassIcon";
import ProfessorIcon from "./ProfessorIcon";
import UnPinIcon from "./UnPinIcon";
import ExclamationMarkIcon from "./ExclamationMark";
import CheckIcon from "./Check";
import RoundedPinIcon from "./RoundedPin";

export const Icons = {
  admin: AdminIcon,
  arrow: Arrow,
  bell: BellIcon,
  book:BookIcon,
  cardView: CardViewIcon,
  check: CheckIcon,
  class: ClassIcon,
  close: CloseIcon,
  curriculum: CurriculumIcon,
  door: DoorIcon,
  edit: EditIcon,
  exclamtion:ExclamationMarkIcon,
  email: EmailIcon,
  expandCenterColumn: ExpandCenterColumnIcon,
  failedClass: FailedClassIcon,
  filter: FilterIcon,
  frascoOutline: FrascoOutlineIcon,
  frascoFill: FrascoFilledIcon,
  handleGrip: HandleGripIcon,
  hashmark: HashmarkIcon,
  list: ListIcon,
  minus: MinusIcon,
  numberAscending: NumberAscendingIcon,
  numberDescending: NumberDescendingIcon,
  panelToLeft: PanelToLeftIcon,
  person: PersonIcon,
  professor:ProfessorIcon,
  twoPersons: TwoPersonsIcon,
  pin: PinIcon,
  roundedPin: RoundedPinIcon,
  unpin:UnPinIcon,
  plus: PlusIcon,
  progress: ProgressIcon,
  schedule: ScheduleIcon,
  schoolEmail: SchoolEmailIcon,
  schoolHat: SchoolHatIcon,
  search: SearchIcon,
  sort: SortIcon,
  status: StatusIcon,
  stickArrowDown: StickArrowDownIcon,
  textAscending: TextAscendingIcon,
  textDescending: TextDescendingIcon,
  threeColumns: ThreeColumnsIcon,
  threePointMenu: ThreePointMenuIcon,
  tilde: TildeIcon,
  toolFill: ToolFillIcon,
  toolOutline: ToolOutlineIcon,
  triangleArrow: TriangleArrowIcon,
  unvisible: UnvisibleIcon,
  visible: VisibleIcon,
  whatsapp: WhatsAppIcon,
  zoomIn: ZoomInIcon,
  zoomOut: ZoomOutIcon,
} as const;

export type IconName = keyof typeof Icons;

export const MyIcons = Icons;
export type MyIcon = IconName;
