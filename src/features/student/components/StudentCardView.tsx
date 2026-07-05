import StudyPlan from "@/components/StudyPlan";
import { cn } from "@/lib/util";
import Memo from "./Memo";
import SchoolEmailIcon from "@/components/icon/SchoolEmailIcon";
import EmailIcon from "@/components/icon/EmailIcon";
import WhatsAppIcon from "@/components/icon/WhatsAppIcon";
import Image from "next/image";
import { Contact } from "../types/types";

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
};

export default function StudentCardView({ className, student }: Props) {
  return (
    <div
      className={cn(
        "max-w-[calc(100vw*3/7)] p-5 inline-flex  flex-col gap-5 bg-header rounded-lg border border-divider",
        className,
      )}
    >
      {/* top */}
      <div className="flex gap-2.5 h-fit">
        {/* img */}
        {/* <div className="h-full max-h-full aspect-square relative">
          <Image width={100} height={100} src={student.img} alt={student.name} className=" h-full object-cover rounded-xl" />
              </div> */}
        <div className="relative aspect-square self-stretch">
          <Image
            src={student.img}
            alt={student.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        {/* info */}
        <div className="flex flex-col gap-3 h-fit">
          <div className="flex gap-2.5 items-center">
            <span className="text-lg font-medium leading-none">{student.name}</span>
            <div className="font-medium text-xs px-1.5 text-white bg-lime-500 rounded-full">
              {student.status}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 items-start">
            <span className="text-[0.8rem] font-medium">{student.career}</span>
            <StudyPlan plan={student.plan} className={""} />
          </div>
        </div>
      </div>

      {/* middle */}
      <div className="flex items-start gap-6">
        <InfoItem label="id" value={student.id} />
        <InfoItem label="semester" value={student.semester} />
        <InfoItem label="advance" value={`${student.advance}%`} />
        <InfoItem label="requisitos" value={`${student.requirements}/2`} />
        <InfoItemContact value={"student.contact"} />
      </div>

      {/* memo */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-xs font-medium">notas:</span>
        <Memo memo={student.memo} className={"max-w-full w-full h-28"} />
      </div>
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
