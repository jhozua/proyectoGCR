(function(){
	angular.module('adminBusinessModule')
	.constant("MENSAJES", {
		"TIPO": {
			"WARNING": 412,
			"INFO": 404,
			"SUCCESS": 200,
			"ERROR": 500,
			"PRECONDITION": 406
		},
		"ERROR": {
			"GENERAL": "Ocurrió un error inesperado.",
			"COMUNICACION": " Ha ocurrido un error al establecer comunicación con el servidor. Por favor contacte al administrador del sistema."
		},
		"BOTON_CONFIRMACION": {
			"SI": "Si",
			"NO": "No"
		},
		"COMITES": {
			"ADMIN_PARTICIPANTES": {
				"ELIMINAR": {
					"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR PARTICIPANTES",
					"CONFIRMAR_ELIMINAR": "Los participantes seleccionados serán eliminados. Solamente ejecutando el botón Guardar se aplicarán los cambios de forma permanente. Desea continuar?",
					"SIN_ELEMENTOS_ELIMINAR": "No se han seleccionado participantes para eliminar del sistema."						
				}
			},
			"PARTICIPANTES": {
				"ELIMINAR": {
					"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR PARTICIPANTES",
					"CONFIRMAR_ELIMINAR": "Los participantes seleccionados serán eliminados. Solamente ejecutando el botón Guardar se aplicarán los cambios de forma permanente. Desea continuar?",
					"SIN_ELEMENTOS_ELIMINAR": "No se han seleccionado participantes para eliminar del comité."					
				},				
				"AGREGAR": {
					"TITULO_CONFIRMAR_AGREGAR": "AGREGAR PARTICIPANTES",
					"CONFIRMAR_AGREGAR": "¿Está seguro que desea agregar los participantes seleccionados?",
					"SIN_ELEMENTOS_AGREGAR": "No se han seleccionado participantes para agregar al comité.",					
					"TODOS": " Participantes agregados correctamente. Si ha terminado de agregar los participantes, por favor seleccione la opción Atrás.",
					"ALGUNOS": " Algunos Participantes seleccionados ya han sido agregados anteriormente. Solamente se agregaron los participantes que no han sido adicionados. ",
					"NINGUNO": " Todos los participantes seleccionados ya han sido agregados anteriormente. "
				},
				"CREAR": "El participante se creó correctamente.",
				"ACTUALIZAR_TODOS": "Los participantes se actualizaron correctamente.",
				"ACTUALIZAR": "El participante se actualizó correctamente."				
			},
			"GUARDAR": {
				"SECRETARIO_SIN_USUARIO": "Existe algún participante marcado como secretario que no tiene registrado el usuario BPM.",
				"SIN_SECRETARIO": "Es necesario marcar por lo menos a uno de los participantes como secretario.",
				"SIN_PARTICIPANTES": "Por favor agregue por lo menos un participante.",
				"MAX_PARTICIPANTES_UNIPERSONAL": "El comité está configurado como Unipersonal. Solo se permite agregar un participante.",
				"EXITO": "La información del comite se registró correctamente."
			},
			"ACTUALIZAR": {
				"EXITO": "La información del comité se actualizó correctamente."
			},
			"ELIMINAR": {
				"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR COMITÉ",
				"CONFIRMAR_ELIMINAR": "¿Está seguro que desea eliminar el comité {{nombreComite}}?"
			}
		},
		"CUTPA":{
			"AGREGAR_EMPRESAS":{
				"AGREGADOS": " Miembros agregados correctamente. Si ha terminado de agregar los miembros, por favor seleccione la opción Atrás.",
				"ALGUNOS AGREGADOS": " Algunos miembros seleccionados ya han sido agregados anteriormente. Solamente se agregaron los miembros que no han sido adicionados. ",
				"TODOS_YA_AGREGADOS": " Todos los miembros seleccionados ya han sido agregados anteriormente."
			},
			"ELIMINAR_MIEMBROS":{
				"TITULO": "ELIMINAR MIEMBROS",
				"NO_SELECCION": "No se han seleccionado miembros para eliminar del grupo.",
				"ALERT":"Los miembros seleccionados serán eliminados de la figura de agrupamiento. Solamente ejecutando el botón Guardar se aplicarán los cambios de forma permanente. ¿Desea continuar?",
				"ALERT_CREAR": "¿Está seguro que desea eliminar los miembros seleccionados?"
			},
			"CONSULTAR":{
				"CAMPOS_INCOMPLETOS": "Favor diligenciar el tipo de agrupamiento, el tipo y no. de identificación.",
				"EXITO": "Se cargó correctamente la información del C/UT/PA.",
				"PUEDE_CREAR": "La figura de agrupamiento no existe, pero es posible crearla."
			},
			"ACTUALIZAR": {
				"EXITO":"La información del C/UT/PA se actualizó correctamente.",
				"ERROR": "Faltan campos obligatorios por diligenciar.",
				"PORCENTAJES": "Por favor validar los valores del % de Participación. Recuerde que la suma de los % de participación de los miembros no debe superar el 100%."
			},
			"CREAR": {
				"EXITO":"La información del C/UT/PA se registró correctamente.",
				"ERROR": "Faltan campos obligatorios por diligenciar.",
				"ERROR_PCT_PART" : "Porcentajes de participación inválidos."
			},
			"ELIMINAR":{
				"TITULO":"ELIMINAR FIGURA DE AGRUPAMIENTO",
				"MENSAJE": "¿Está seguro que desea eliminar la figura de agrupamiento {{nombreFig}}?"
			},
			"ACTUALIZAR_PA": {
				"VALIDACION": {
					"FIDUCIARIA_TEMP": "Por favor seleccione un valor diferente a '{pa_temporal}' en el campo Fiduciaria.",
					"CONFIRMACION": "¿Está seguro que desea actualizar los datos del patrimonio autónomo?"
				}
			}
		},
		"GRUPOS": {
			"GUARDAR": {
				"EXITO": "Información guardada exitosamente.",
				"SIN_LIDER": " Por favor verifique que exista un miembro relacionado como Líder.",
				"NO_CRM": " Por favor verifique que todas las empresas asociadas existan en el CRM."
			},
			"ELIMINAR": {
				"EXITO": "El grupo fue inactivado exitosamente.",
				"TITULO_CONFIRMAR_ELIMINAR": "INACTIVAR GRUPO",
				"CONFIRMAR_ELIMINAR": "El grupo {{nombreGrupo}} será inactivado de forma permanente, sin posibilidad de deshacer los cambios. ¿Desea continuar?"
			},
			"MIEMBROS": {
				"ELIMINAR": {
					"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR MIEMBROS GRUPO",
					"CONFIRMAR_ELIMINAR": "Las empresas y/o grupos seleccionados serán eliminados del grupo. Solamente ejecutando el botón Guardar se aplicarán los cambios de forma permanente. ¿Desea continuar?",
					"SIN_ELEMENTOS_ELIMINAR": "No se han seleccionado miembros para eliminar del grupo."
				},
				"AGREGAR": {
					"TODOS": " Miembros agregados correctamente. Si ha terminado de agregar los miembros, por favor seleccione la opción Atrás.",
					"ALGUNOS": " Algunos Miembros seleccionados ya han sido agregados anteriormente. Solamente se agregaron los miembros que no han sido adicionados. ",
					"NINGUNO": " Todos los miembros seleccionados ya han sido agregados anteriormente. "
				}
			}
		},
		"PLANTILLAS": {
			"GUARDAR": {
				"EXITO": "Información guardada exitosamente.",
				"SIN_LIDER": " Por favor verifique que exista un miembro relacionado como Líder."
			},
			"ELIMINAR": {
				"EXITO": "La plantilla fue eliminada exitosamente.",
				"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR PLANTILLAS",
				"TITULO_CONFIRMAR_ELIMINAR_LINEAS": "ELIMINAR LÍNEAS",
				"TITULO_CONFIRMAR_ELIMINAR_MODALIDADES": "ELIMINAR MODALIDADES/LÍNEAS",
				"CONFIRMAR_ELIMINAR": "Las plantillas seleccionadas serán eliminadas. Debe hacer click en 'Guardar' para persistir los cambios. ¿Desea continuar?",
				"ELIMINAR_MODALIDADES": "Se eliminarán los items seleccionados. ¿Desea continuar?"
			
			},
			"ADVERTENCIA": {
				"DUPLICIDAD": "La modalidad selecionada NO permite duplicidad.",
				"CONFIRMAR_ELIMINAR": "Las plantillas seleccionadas serán eliminadas. Debe hacer click en 'Guardar' para persistir los cambios. ¿Desea continuar?",
				"NO_ELIMINADO":"No se han seleccionado items para eliminar."
			}
		},
		"SEGURIDAD":{
			"FUNCIONALIDADES":{
				"ACTUALIZAR_EXITO": "Funcionalidades actualizadas correctamente."
			},
			"CAMPOS":{
				"ACTUALIZAR_EXITO": "Campos actualizados correctamente.",
				"ERROR_CARGADO": "Error al cargar la visibilidad de campos."
			},
			"ROLES":{
				"ACTUALIZAR_EXITO": "Roles de usuario LDAP actualizados correctamente.",
				"NO_ROLES_ASOCIADOS":"No se encontraron roles asociados.",
				"NO_ROLES_DISPONIBLES":"No se encontraron roles disponibles.",
				"ELIMINAR_FUNCIONALIDADES": {
					"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR FUNCIONALIDADES",
					"CONFIRMAR_ELIMINAR": "Las funcionalidades seleccionados serán desasociadas. Solamente haciendo clic en el botón Guardar se aplicarán los cambios de forma permanente. ¿Desea continuar?",
					"SIN_ELEMENTOS_ELIMINAR": "No se han seleccionado funcionalidades para desasociar de este rol."						
				},
				"ACTUALIZAR_FUNCIONALIDADES":{
					"EXITO": "Funcionalidades del rol actualizadas correctamente."
				},
				"NO_FUNCIONALIDADES_DISPONIBLES": "El rol no tiene funcionalidades disponibles."
			}
		},
		"COMPARAR_PC":{
			"CARGA_ARCHIVO":{
				"EXITO":"Carga exitosa de archivo."
			},
			"COMPARAR_ARCHIVOS":{
				"EXITO_COMPARACION":"Comparación exitosa de archivos",
				"ERROR_COMPARACION":"Se deben cargar archivos previamente."
			}
		},
		"PC_GRUPOS":{
			"CONSULTAR":{
				"SIN_REGISTROS": "La empresa no existe en el sistema o no pertenece a algún grupo."
			}
		},
		"GRUPOS_SEGURIDAD": {
			"GUARDAR": {
				"EXITO": "Información guardada exitosamente.",
				"SIN_LIDER": " Por favor verifique que exista un miembro relacionado como Líder."
			},
			"ELIMINAR": {
				"EXITO": "La plantilla fue eliminada exitosamente.",
				"TITULO_CONFIRMAR_ELIMINAR": "ELIMINAR GRUPOS",
				"TITULO_CONFIRMAR_ELIMINAR_PROCESOS": "ELIMINAR PROCESOS",
				"CONFIRMAR_ELIMINAR": "Los grupos seleccionados serán eliminados. Debe hacer click en 'Guardar' para persistir los cambios. ¿Desea continuar?",
				"ELIMINAR_PROCESOS": "Se eliminarán los items seleccionados. ¿Desea continuar?"
			
			},
			"ADVERTENCIA": {
				"CONFIRMAR_ELIMINAR": "Los grupos seleccionados serán eliminados. Debe hacer click en 'Guardar' para persistir los cambios. ¿Desea continuar?",
				"NO_ELIMINADO":"No se han seleccionado items para eliminar."
			}
		},
	});

})();