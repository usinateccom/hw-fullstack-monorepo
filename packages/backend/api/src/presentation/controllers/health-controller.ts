import { GetHealthUseCase } from "../../application/use-cases/get-health";

export class HealthController {
  constructor(private readonly getHealthUseCase: GetHealthUseCase) {}

  handle() {
    return this.getHealthUseCase.execute();
  }
}
