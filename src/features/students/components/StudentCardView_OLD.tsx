import StudyPlan from "@/components/StudyPlan";
import { cn } from "@/shared/lib/util";
import SchoolEmailIcon from "@/components/icon/SchoolEmailIcon";
import EmailIcon from "@/components/icon/EmailIcon";
import WhatsAppIcon from "@/components/icon/WhatsAppIcon";
type Contact = {
  schoolEmail: string;
  privateEmail: string;
  phone: string;
};
import Avator from "@/components/Avator";

type Props = {
  className?: string;
  student: StudentCardViewProps;
};
type StudentCardViewProps = {
  img: string;
  name: string;
  status: string;
  career: string;
  plan: string;
  id: string;
  semester: string;
  advance: number;
  requirements: number;
  contact: Contact;
  memo: string;
  avatarColorCssVar: string;
};

export default function StudentCardView_OLD({ className, student }: Props) {
  return (
    <div
      className={cn(
        "w-full min-w-full p-2 inline-flex  flex-col gap-2 bg-header rounded-lg border border-divider",
        className,
      )}
    >
      {/* top */}
      <div className="flex gap-2.5 h-fit w-full">
        <Avator fullName={student.name} className="w-10 h-10 text-xl font-semibold" style={{ backgroundColor: `var(${student.avatarColorCssVar})` }} />
        {/* info */}
        <div className="flex flex-col gap-2 h-fit w-full">
          <div className="flex gap-2.5 items-center">
            <span className="text-base font-medium leading-none whitespace-nowrap">{student.name}</span>
            {/* <div className={cn("font-medium text-xs px-1.5 text-white bg-lime-500 rounded-full",
              student.status === "Inactivo" && "bg-gray-500" ,
              student.status === "Baja Académica" &&"bg-gray-500" ,
              student.status === "Baja voluntaria" &&"bg-gray-500" ,
            )}>
              {student.status}
            </div> */}
          </div>

          <div className="flex  items-center w-full">
            <div className={cn("font-medium text-xs px-1.5 text-white bg-lime-500 rounded-full",
              student.status === "Inactivo" && "bg-gray-500" ,
              student.status === "Baja Académica" &&"bg-gray-500" ,
              student.status === "Baja voluntaria" &&"bg-gray-500" ,
            )}>
              {student.status}
            </div>
            <span className="ml-4 text-xs font-medium">{student.career}</span>
            <StudyPlan plan={student.plan} className={"ml-2.5 text-xs whitespace-nowrap"} />
           
          </div>
        </div>
      </div>

      {/* middle */}
      <div className="flex items-start gap-6 pl-1">
        <InfoItem label="id" value={student.id} />
        <InfoItem label="semester" value={student.semester} />
        {/* <InfoItem label="advance" value={`${student.advance}%`} />
        <InfoItem label="requisitos" value={`${student.requirements}/2`} /> */}
        <InfoItemContact value={"student.contact"} />
      </div>

      {/* memo */}
      {/* <div className="flex flex-col gap-1.5 w-full">
        <span className="text-xs font-medium">notas:</span>
        <Memo memo={student.memo} className={"max-w-full w-full h-28"} />
      </div> */}
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-0 items-start">
      <span className="text-xs font-medium">{label}:</span>
      <span className="text-[0.8rem] font-normal">{value}</span>
    </div>
  );
};

const InfoItemContact = ({
  label = "contacto",
  value,
}: {
  label?: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col gap-0 items-start">
      <span className="text-xs font-medium">{label}:</span>
      <span className="flex gap-2.5 font-normal">
        <SchoolEmailIcon className=" h-6" />
        <EmailIcon className=" h-6" />
        <WhatsAppIcon className=" h-6" />
      </span>
    </div>
  );
};
