export class UpdateProfileDTO {
  description?: string | null;
  vision?: string | null;
  mission?: string | null;
  motto?: string | null;
  structure_org?: string | null;
  maklumat?: string | null;
  task_org?: string | null;
  function_org?: string | null;

  constructor(data?: Partial<UpdateProfileDTO>) {
    this.description = data?.description;
    this.vision = data?.vision;
    this.mission = data?.mission;
    this.motto = data?.motto;
    this.structure_org = data?.structure_org;
    this.maklumat = data?.maklumat;
    this.task_org = data?.task_org;
    this.function_org = data?.function_org;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.vision !== undefined && this.vision && this.vision.length > 1000) {
      errors.push('Visi maksimal 1000 karakter');
    }
    if (this.mission !== undefined && this.mission && this.mission.length > 1000) {
      errors.push('Misi maksimal 1000 karakter');
    }
    if (this.motto !== undefined && this.motto && this.motto.length > 255) {
      errors.push('Motto maksimal 255 karakter');
    }

    return errors;
  }
}
