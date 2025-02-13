// @@@ pwned by 1m4unkn0wn @@@
import { FakeTaskDto } from "./FakeTaskDto";

export interface FakeProjectDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  active: boolean;
  tasks: FakeTaskDto[];
}
