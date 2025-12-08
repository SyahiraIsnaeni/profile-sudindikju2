export class GetProfileDTO {
  id: number;
  description?: string | null;
  vision?: string | null;
  mission?: string | null;
  motto?: string | null;
  structure_org?: string | null;
  maklumat?: string | null;
  task_org?: string | null;
  function_org?: string | null;
  created_at: Date;
  updated_at: Date;

  constructor(data: {
    id: number;
    description?: string | null;
    vision?: string | null;
    mission?: string | null;
    motto?: string | null;
    structure_org?: string | null;
    maklumat?: string | null;
    task_org?: string | null;
    function_org?: string | null;
    created_at: Date;
    updated_at: Date;
  }) {
    this.id = data.id;
    this.description = data.description ?? null;
    this.vision = data.vision ?? null;
    this.mission = data.mission ?? null;
    this.motto = data.motto ?? null;
    this.structure_org = data.structure_org ?? null;
    this.maklumat = data.maklumat ?? null;
    this.task_org = data.task_org ?? null;
    this.function_org = data.function_org ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
