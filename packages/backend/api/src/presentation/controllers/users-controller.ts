import { ClearUsersUseCase } from "../../application/use-cases/clear-users";
import { ExecuteUsersPipelineUseCase } from "../../application/use-cases/execute-users-pipeline";

export class UsersController {
  constructor(
    private readonly executeUsersPipelineUseCase: ExecuteUsersPipelineUseCase,
    private readonly clearUsersUseCase: ClearUsersUseCase
  ) {}

  execute() {
    return this.executeUsersPipelineUseCase.execute();
  }

  clear() {
    return this.clearUsersUseCase.execute();
  }
}
