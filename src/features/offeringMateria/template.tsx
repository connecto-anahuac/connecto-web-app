"use client";

import {
    getOfferingMaterialsByCareerUseCase,
    getSelectedOfferingMaterialsUseCase,
    setOfferingMaterialSelectionUseCase,
} from "@/infra/di";
import { useEffect, useState } from "react";
import OfferingClassCardView from "./ClassCardView";
import Diagram from "./Diagram";
import { OfferingMaterial } from "./entity";
import { getTotalEligibleStudents } from "./get_total_eligible_students";

type Props = {
    career: string;
};

export default function OfferingMaterialTemplate({ career }: Props) {
    const [offeringMaterials, setOfferingMaterials] = useState<OfferingMaterial[]>([]);
    const [selectedMateriaKeys, setSelectedMateriaKeys] = useState<string[]>([]);
    const [pendingMateriaKeys, setPendingMateriaKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setError(null);
            setPendingMateriaKeys([]);

            try {
                const [items, selectedOfferingMaterials] = await Promise.all([
                    getOfferingMaterialsByCareerUseCase.execute(career),
                    getSelectedOfferingMaterialsUseCase.execute(career),
                ]);
                
                if (!mounted) {
                    return;
                }

                setOfferingMaterials(items);
                setSelectedMateriaKeys([
                    ...new Set(selectedOfferingMaterials.map((item) => item.materiaKey)),
                ]);
            } catch (loadError) {
                if (!mounted) {
                    return;
                }

                console.error("Failed loading offering materials", loadError);
                setError("Failed loading offering materials");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [career]);

    const handleToggleOfferingMaterial = async (offeringMaterial: OfferingMaterial) => {
        if (pendingMateriaKeys.includes(offeringMaterial.key)) {
            return;
        }

        const isCurrentlySelected = selectedMateriaKeys.includes(offeringMaterial.key);
        const nextIsSelected = !isCurrentlySelected;

        setPendingMateriaKeys((currentKeys) => [...currentKeys, offeringMaterial.key]);
        setSelectedMateriaKeys((currentKeys) =>
            nextIsSelected
                ? [...currentKeys, offeringMaterial.key]
                : currentKeys.filter((currentKey) => currentKey !== offeringMaterial.key),
        );

        try {
            await setOfferingMaterialSelectionUseCase.execute({
                career,
                offeringMaterial,
                estimatedNumber: getTotalEligibleStudents(offeringMaterial),
                isSelected: nextIsSelected,
            });
        } catch (toggleError) {
            console.error("Failed toggling offering material selection", toggleError);
            setSelectedMateriaKeys((currentKeys) =>
                isCurrentlySelected
                    ? [...currentKeys, offeringMaterial.key]
                    : currentKeys.filter((currentKey) => currentKey !== offeringMaterial.key),
            );
        } finally {
            setPendingMateriaKeys((currentKeys) =>
                currentKeys.filter((currentKey) => currentKey !== offeringMaterial.key),
            );
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (offeringMaterials.length === 0) {
        return <div>No materias found for {career}</div>;
    }

    const maxSemester = Math.max(...offeringMaterials.map((item) => item.semester), 1);
    const maxPosition = Math.max(...offeringMaterials.map((item) => item.position), 1)+1;

    return (
        <div className="overflow-auto p-2.5 w-full h-full">
            <Diagram maxSemester={maxSemester} maxPosition={maxPosition} >
               
                {offeringMaterials.map((offeringMaterial) => (
                    <div
                        key={`${offeringMaterial.key}-${offeringMaterial.semester}-${offeringMaterial.position}`}
                        style={{
                            gridColumnStart: offeringMaterial.semester  +1|| 2,
                            gridRowStart: offeringMaterial.position+ 1+1 || 2,
                        }}
                        
                    >
                        <OfferingClassCardView
                            offeringClass={offeringMaterial}
                            className="w-full"
                            isSelected={selectedMateriaKeys.includes(offeringMaterial.key)}
                            isPending={pendingMateriaKeys.includes(offeringMaterial.key)}
                            onToggle={() => void handleToggleOfferingMaterial(offeringMaterial)}
                        />
                    </div>
                ))}
            </Diagram>
        </div>
    );
}