export interface IValidationElement {
  validacionId: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaUltimaModificacion: string;
  usuarioUltimaModificacion: string;
}

export interface IValidationCatalog {
  text: string;
  value: string;
}
