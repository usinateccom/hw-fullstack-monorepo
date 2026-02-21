import { ClearUsersUseCase } from "../../application/use-cases/clear-users";
import { ExecuteUsersPipelineUseCase } from "../../application/use-cases/execute-users-pipeline";
import { SeedUsersUseCase } from "../../application/use-cases/seed-users";

export class UsersController {
  constructor(
    private readonly executeUsersPipelineUseCase: ExecuteUsersPipelineUseCase,
    private readonly clearUsersUseCase: ClearUsersUseCase,
    private readonly seedUsersUseCase: SeedUsersUseCase
  ) {}

  execute() {
    return this.executeUsersPipelineUseCase.execute();
  }

  clear() {
    return this.clearUsersUseCase.execute();
  }

  seed(count: number) {
    return this.seedUsersUseCase.execute(count);
  }
}
