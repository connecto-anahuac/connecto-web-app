import { OfferingMaterialRepository } from "@/infra/local/repository/offering_material.repository";
import { OfferingMaterialEntity } from "@/infra/local/entities";
import { OFFERING_SELECTION_PERIOD } from "./selection_config";

export class GetSelectedOfferingMaterialsUseCase {
  constructor(private readonly repository: OfferingMaterialRepository) {}

  async execute(career: string): Promise<OfferingMaterialEntity[]> {
    return this.repository.findByCareerAndPeriod(career, OFFERING_SELECTION_PERIOD);
  }
}