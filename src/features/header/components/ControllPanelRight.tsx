import StudentCardView from "@/features/student/components/StudentCardView";
import { cn } from "@/lib/util";

type Props = {
  className?: string;
};
export default function ControllPanelRight({ className }: Props) {

    const student = {
        img:"/data/avator.png",
        name: "Ryan Garcia Diaz",
        status: "Active",
        career: "Ingeniería en informática y negocios digitales",
        plan: "plan 2016",
        id: "00392461",
        semester: "5th",
        advance: 75,
        requirements: 1,
        contact: {
            schoolEmail: "ryan.garcia@anahuac.mx",
            phone: "123-456-7890",
            privateEmail: "ryan.garcia@gmail.com"
        },
        memo: "This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas. This is a memo. This is a memo. Toma notas notas nononononotas."
    };



    return <div className={cn("flex items-start justify-end gap-2", className)}>
      <StudentCardView student={student}/>
      
  </div>;
}
