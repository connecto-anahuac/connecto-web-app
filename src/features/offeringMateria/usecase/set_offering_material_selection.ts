import { OfferingMaterial } from "../entity";
import { OfferingMaterialRepository } from "@/infra/local/repository/offering_material.repository";
import { OFFERING_SELECTION_PERIOD, createOfferingMaterialSelectionId } from "./selection_config";

type ExecuteParams = {
  career: string;
  offeringMaterial: OfferingMaterial;
  estimatedNumber: number;
  isSelected: boolean;
};

export class SetOfferingMaterialSelectionUseCase {
  constructor(private readonly repository: OfferingMaterialRepository) {}

  async execute({
    career,
    offeringMaterial,
    estimatedNumber,
    isSelected,
  }: ExecuteParams): Promise<void> {
    const id = createOfferingMaterialSelectionId(career, offeringMaterial.key);

    if (!isSelected) {
      await this.repository.delete(id);
      return;
    }

    await this.repository.save({
      id,
      period: OFFERING_SELECTION_PERIOD,
      career,
      materiaKey: offeringMaterial.key,
      sessionNumber: 0,
      estimatedNumber,
    });
  }
}