-- juridicOS · Biblioteca global de plantillas forenses (Córdoba, AR)
-- Generado por workflow 'biblioteca-plantillas-forenses' (18 escritos auditados).
-- Estructura derivada de demanda real del portal de Demandas Electrónicas de
-- Justicia Córdoba. Idempotente (on conflict do update). Fuente: plantillas-globales.json
-- Requiere migración previa: plantillas_categorizacion (columnas categoria/fuero/descripcion/orden).
begin;

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000001', null, 'global', 'Demanda laboral — Ordinario (LPT)', 'Demanda', 'demanda', 'laboral', 'Demanda laboral ordinaria ante el fuero del trabajo de Córdoba (ley 7987) por rubros indemnizatorios y salariales, con planilla anexa y ofrecimiento completo de prueba', 10, ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','contraparte_nombre','contraparte_cuit','contraparte_domicilio','monto_letras','monto','fecha_ingreso','categoria_laboral','cct_aplicable','lugar_trabajo','jornada_laboral','remuneracion_letras','remuneracion_mensual','fecha_egreso']::text[], $tpl$PROMUEVE DEMANDA LABORAL ORDINARIA

{{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{cliente_domicilio}}, con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por la presente a promover formal demanda laboral ordinaria (ley 7987) en contra de {{contraparte_nombre}}, CUIT N.º {{contraparte_cuit}}, con domicilio en {{contraparte_domicilio}}, tendiente al cobro de la suma de pesos {{monto_letras}} ($ {{monto}}) o lo que en más o en menos resulte de la prueba a rendir y considere el Tribunal de mérito, en concepto de los rubros indemnizatorios, salariales y demás conceptos que se detallan en el apartado III y en la planilla de liquidación que se acompaña como parte integrante de la presente, con más intereses desde que cada suma es debida y hasta su efectivo pago, y costas, conforme a los hechos y el derecho que seguidamente expongo.

[PENDIENTE: evaluar si el caso encuadra en el procedimiento declarativo abreviado, art. 83 bis LPT (ley 7987); en su caso, solicitar expresamente en este apartado la aplicación de dicho trámite].

II. HECHOS. RELACIÓN LABORAL.

1. Ingreso y condiciones de contratación. Ingresé a trabajar bajo relación de dependencia jurídica, económica y técnica de la demandada el día {{fecha_ingreso}}, desempeñándome en la categoría de {{categoria_laboral}} del Convenio Colectivo de Trabajo {{cct_aplicable}}, cumpliendo tareas de [PENDIENTE: describir las tareas concretas desempeñadas], en el establecimiento sito en {{lugar_trabajo}}.

2. Jornada y remuneración. La jornada de labor se desarrollaba {{jornada_laboral}}. La mejor remuneración mensual, normal y habitual devengada ascendió a la suma de pesos {{remuneracion_letras}} ($ {{remuneracion_mensual}}). [PENDIENTE: indicar si existieron pagos fuera de registro, deficiente registración de fecha de ingreso, categoría o remuneración, o diferencias salariales, y relatarlos con precisión].

3. Desarrollo de la relación laboral. [PENDIENTE: relatar cronológicamente los hechos relevantes de la relación de trabajo: cumplimiento de tareas, incumplimientos patronales, modificaciones de condiciones de trabajo, sanciones, suspensiones, enfermedades o accidentes, según el caso].

4. Extinción del vínculo. La relación laboral se extinguió el día {{fecha_egreso}} por [PENDIENTE: indicar la causal de extinción: despido directo con o sin invocación de causa, despido indirecto, no registración, negativa de tareas, etc., y desarrollar las circunstancias que lo configuraron].

5. Intercambio epistolar. [PENDIENTE: transcribir cronológicamente el intercambio epistolar habido entre las partes, con fecha y número de cada despacho: telegramas ley 23.789 (telegrama obrero gratuito) remitidos por el trabajador y cartas documento remitidas por la empleadora, consignando textualmente las intimaciones cursadas (aclaración de situación laboral, dación de tareas, correcta registración, pago de haberes) y sus respuestas o silencios].

6. No obstante las intimaciones cursadas, la demandada no abonó las indemnizaciones, haberes y demás rubros adeudados, ni hizo entrega de la documentación laboral correspondiente, lo que motiva la promoción de la presente acción.

III. RUBROS RECLAMADOS.

Conforme surge de la planilla de liquidación que se acompaña y forma parte integrante de la presente demanda, reclamo los siguientes rubros, cuyos montos se discriminan en aquella:

A. Indemnización por antigüedad (art. 245 LCT).

B. Indemnización sustitutiva de preaviso (arts. 231 y 232 LCT).

C. Integración del mes de despido (art. 233 LCT).

D. Haberes adeudados correspondientes a [PENDIENTE: indicar períodos impagos].

E. Sueldo anual complementario proporcional y adeudado (arts. 121 a 123 LCT).

F. Vacaciones proporcionales no gozadas (art. 156 LCT).

G. [PENDIENTE: agregar, según el caso, diferencias salariales, horas extraordinarias, multas o agravamientos indemnizatorios que resulten procedentes conforme la normativa vigente a la fecha del distracto, verificando las derogaciones introducidas por la ley 27.742].

H. Entrega del certificado de trabajo y de la certificación de servicios y remuneraciones (art. 80 LCT).

Todos los rubros se reclaman con más los intereses correspondientes desde que cada suma es debida y hasta su efectivo pago, conforme [PENDIENTE: indicar la tasa de interés aplicable según el criterio vigente del TSJ de Córdoba en materia laboral].

IV. PRUEBA.

Ofrezco la siguiente prueba, sin perjuicio de la facultad de ampliarla en la oportunidad procesal correspondiente:

1. DOCUMENTAL:

A. Recibos de haberes correspondientes a [PENDIENTE: indicar períodos].

B. Despachos telegráficos y cartas documento que instrumentan el intercambio epistolar relacionado en el apartado II.

C. [PENDIENTE: enumerar la restante documental que se acompaña: constancias de alta y baja registral, certificados médicos, liquidación final, recibos de entrega de elementos de trabajo, etc.].

2. INFORMATIVA:

A. Al Correo Oficial de la República Argentina S.A., para que informe sobre la autenticidad, texto, fecha de imposición y constancias de entrega de los despachos telegráficos y cartas documento individualizados en la documental.

B. A la Agencia de Recaudación y Control Aduanero (ARCA, ex AFIP), para que informe la situación registral del actor respecto de la demandada, fecha de alta y baja, remuneraciones declaradas y aportes y contribuciones efectuados.

C. [PENDIENTE: agregar otros oficios informativos pertinentes: obra social, sindicato, bancos por acreditación de haberes, etc.].

3. CONFESIONAL:

Se cite a la demandada a absolver posiciones a tenor del pliego que oportunamente se acompañará, bajo apercibimiento de ley. Para el caso de tratarse de persona jurídica, deberá comparecer por intermedio de su representante legal o de la persona designada al efecto, con facultades suficientes.

4. TESTIMONIAL:

Se cite a prestar declaración testimonial, a tenor del interrogatorio que oportunamente se formulará, a las siguientes personas:

A. [PENDIENTE: nombre completo, DNI, domicilio y ocupación del testigo].

B. [PENDIENTE: nombre completo, DNI, domicilio y ocupación del testigo].

C. [PENDIENTE: agregar o suprimir testigos según el caso, verificando el número máximo admitido por la ley procesal].

5. PERICIAL:

PERICIAL CONTABLE: Se designe perito contador oficial para que, compulsando el libro especial del art. 52 LCT y demás libros, registros y documentación laboral, contable e impositiva de la demandada, dictamine sobre los siguientes puntos: a) si los libros y registros laborales son llevados en legal forma; b) fecha de ingreso, categoría y remuneración registradas del actor; c) remuneraciones efectivamente abonadas y su composición; d) cálculo de los rubros reclamados conforme la planilla acompañada, con más sus intereses; e) aportes y contribuciones a la seguridad social efectuados; f) [PENDIENTE: agregar puntos de pericia específicos del caso]. Hago reserva de proponer perito de control de parte.

6. EXHIBICIÓN - RECONOCIMIENTO:

Se intime a la demandada a exhibir el libro especial del art. 52 LCT, los duplicados de los recibos de haberes (art. 139 LCT), planillas de horarios y demás documentación laboral cuya conservación le impone la ley, bajo apercibimiento de lo dispuesto por el art. 55 LCT. Asimismo, se la cite a reconocer la documental acompañada que se le atribuye, bajo apercibimiento de ley.

V. DERECHO.

Fundo el derecho que asiste a mi parte en lo dispuesto por el art. 14 bis de la Constitución Nacional; la Ley de Contrato de Trabajo 20.744 (arts. 9, 10, 11, 12, 14, 21, 22, 23, 52, 55, 80, 121 a 123, 156, 231 a 233, 245 y concordantes); la ley 7987 (Ley Procesal del Trabajo de la Provincia de Córdoba); la ley 23.789; el Convenio Colectivo de Trabajo {{cct_aplicable}}; el Código Civil y Comercial de la Nación (ley 26.994) en cuanto resulte de aplicación supletoria; y [PENDIENTE: agregar normas específicas del caso, verificando texto vigente].

VI. JURISPRUDENCIA.

[PENDIENTE: citar jurisprudencia aplicable sobre los rubros reclamados, la presunción del art. 23 LCT, las consecuencias de la falta de exhibición de libros (art. 55 LCT) y la tasa de interés, conforme criterio vigente del TSJ de Córdoba y de la Sala interviniente].

VII. BENEFICIO DE GRATUIDAD.

Solicito se tenga presente que el trabajador goza del beneficio de gratuidad consagrado por el art. 20 de la LCT, por lo que los procedimientos judiciales derivados de la presente acción se encuentran exentos de gravámenes fiscales, y su vivienda no podrá ser afectada al pago de costas en caso alguno.

VIII. RESERVA DEL CASO FEDERAL.

Para el hipotético e improbable supuesto de que no se hiciera lugar a la demanda en la forma planteada, dejo formulada expresa reserva del caso federal, a fin de ocurrir por ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario previsto por el art. 14 de la ley 48, por encontrarse comprometidas garantías consagradas por los arts. 14 bis, 17 y 18 de la Constitución Nacional.

IX. SOLICITA REGULACIÓN DE HONORARIOS.

Solicito se regulen los honorarios profesionales del letrado patrocinante correspondientes a la apertura de carpeta, conforme lo dispuesto por el art. 104 inc. 5 de la ley 9459.

X. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, por parte y con el domicilio legal constituido.

2. Tenga por interpuesta en tiempo y forma la demanda laboral incoada en contra de {{contraparte_nombre}}.

3. Tenga por ofrecida la prueba que hace al derecho de mi parte y por acompañada la documental y la planilla de liquidación.

4. Tenga presente el beneficio de gratuidad del art. 20 LCT y la reserva del caso federal formulada.

5. Regule los honorarios profesionales por apertura de carpeta conforme el art. 104 inc. 5 de la ley 9459.

6. Oportunamente al resolver, haga lugar a la demanda en todas sus partes, con más intereses, y con expresa imposición de costas a la parte demandada.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000006', null, 'global', 'Interpone recurso de apelación', 'Recurso', 'recurso', null, 'Interposición de recurso de apelación ante el juez a quo, sin fundar, para su concesión y elevación a la Cámara (art. 366 CPCC Córdoba)', 10, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','fecha_resolucion','fecha_notificacion']::text[], $tpl$INTERPONE RECURSO DE APELACIÓN

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante] de {{cliente_nombre}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por el presente, en el carácter invocado y en legal tiempo y forma, a interponer formal recurso de apelación en contra de la resolución dictada en autos con fecha {{fecha_resolucion}} [PENDIENTE: identificar la resolución apelada: tipo de resolución (sentencia, auto, providencia), número si lo tuviere y puntos de la parte dispositiva que se recurren], por causar la misma gravamen irreparable a esta parte, solicitando se conceda el recurso por ante la Excma. Cámara de Apelaciones que por turno corresponda y se eleven oportunamente los presentes autos, conforme las consideraciones que seguidamente expongo.

II. RESOLUCIÓN APELADA. AGRAVIO.

La resolución recurrida dispuso [PENDIENTE: transcribir o sintetizar la parte dispositiva de la resolución en cuanto es materia de agravio].

Dicho pronunciamiento ocasiona a mi [PENDIENTE: mandante/patrocinado] un gravamen que no puede ser reparado por otra vía, lo que habilita la procedencia formal del presente recurso.

Dejo expresamente aclarado que, de conformidad con el sistema recursivo vigente, el presente recurso se interpone ante el tribunal que dictó la resolución y sin fundar, toda vez que la expresión de agravios deberá efectuarse oportunamente por ante la Excma. Cámara de Apelaciones que resulte sorteada, en la etapa procesal correspondiente (art. 366 del CPCC, ley 8465).

III. INTERPOSICIÓN EN TIEMPO Y FORMA.

La resolución apelada fue notificada a esta parte con fecha {{fecha_notificacion}}, por lo que el presente recurso se deduce dentro del plazo legal previsto por el art. 366 del CPCC (ley 8465), encontrándose interpuesto en legal tiempo y forma. [PENDIENTE: si la causa tramita en un fuero con régimen recursivo propio (p. ej., fuero laboral, ley 7987), verificar la norma y el plazo aplicables y adecuar la cita.]

IV. DERECHO.

Fundo la admisibilidad formal del presente recurso en lo dispuesto por los arts. 361, 366 y concordantes del CPCC de Córdoba (ley 8465), y en las garantías de defensa en juicio y debido proceso consagradas por el art. 18 de la Constitución Nacional. [PENDIENTE: verificar y adecuar las normas procesales citadas si el fuero de tramitación posee régimen recursivo propio.]

V. RESERVA DEL CASO FEDERAL.

Para el hipotético supuesto de que no se conceda el recurso interpuesto, o que oportunamente no se acojan los agravios de esta parte, dejo formulada expresa reserva del caso federal en los términos del art. 14 de la ley 48, por hallarse comprometidas las garantías constitucionales de defensa en juicio, debido proceso y propiedad (arts. 17 y 18 de la Constitución Nacional).

VI. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, en el carácter invocado, y por interpuesto en legal tiempo y forma recurso de apelación en contra de la resolución de fecha {{fecha_resolucion}}.

2. Conceda el recurso de apelación por ante la Excma. Cámara de Apelaciones que por turno corresponda. [PENDIENTE: indicar, si corresponde, el efecto con el que se solicita la concesión.]

3. Oportunamente, eleve los presentes autos a la Excma. Cámara interviniente, a los fines de la expresión de agravios y demás trámite de ley.

4. Tenga presente la reserva del caso federal formulada.

Proveer de conformidad.
SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

update public.plantillas set nombre = 'Carta documento — intimación laboral', tipo = 'Carta documento', categoria = 'comunicacion', fuero = 'laboral', descripcion = 'Intimación extrajudicial del trabajador al empleador por carta documento o telegrama ley 23.789, paso previo al reclamo judicial laboral', orden = 10, variables = ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','localidad','contraparte_nombre','contraparte_documento','contraparte_domicilio','fecha','plazo_intimacion','domicilio_electronico']::text[], contenido = $tpl$CARTA DOCUMENTO — INTIMACIÓN LABORAL
(Utilizable también como Telegrama Obrero Ley 23.789, de remisión gratuita para el trabajador)

REMITENTE: {{cliente_nombre}}, DNI N.º {{cliente_documento}}, con domicilio en {{cliente_domicilio}}, {{localidad}}, Provincia de Córdoba.

DESTINATARIO: {{contraparte_nombre}}, CUIT N.º {{contraparte_documento}}, con domicilio en {{contraparte_domicilio}}.

{{localidad}}, {{fecha}}.

TEXTO DE LA COMUNICACIÓN:

Quien suscribe, {{cliente_nombre}}, DNI N.º {{cliente_documento}}, por derecho propio, en mi carácter de trabajador/a en relación de dependencia de esa empleadora, en la que me desempeño como [PENDIENTE: categoría laboral, tareas y convenio colectivo aplicable], con fecha de ingreso [PENDIENTE: fecha real de ingreso], jornada de trabajo [PENDIENTE: jornada y horario] y remuneración de [PENDIENTE: remuneración mensual], me dirijo a Ud. a fin de INTIMARLO/A para que, en el plazo perentorio e improrrogable de {{plazo_intimacion}} de recibida la presente:

I) [PENDIENTE: detallar intimación — por ejemplo: aclare situación laboral ante la negativa de tareas; registre debidamente la relación laboral con la verdadera fecha de ingreso, categoría y remuneración; abone los haberes adeudados correspondientes a los períodos que se individualicen; cese de inmediato la conducta injuriosa que se describa].

II) [PENDIENTE: intimaciones adicionales si las hubiere — por ejemplo: entregue la certificación de servicios y remuneraciones prevista por el art. 80 LCT; regularice los aportes y contribuciones a la seguridad social; suprimir este punto si no corresponde].

CASO CONTRARIO, y para el supuesto de silencio de su parte —el que, a tenor del art. 57 LCT, hará presumir su negativa a lo aquí requerido—, respuesta evasiva o negativa injustificada, ME CONSIDERARÉ GRAVEMENTE INJURIADO/A Y DESPEDIDO/A POR SU EXCLUSIVA CULPA (arts. 242 y 246 LCT), y accionaré judicialmente por ante los tribunales del fuero del Trabajo de la Provincia de Córdoba (ley 7987), reclamando las indemnizaciones derivadas del despido (arts. 232, 233 y 245 LCT), los salarios y demás rubros adeudados, [PENDIENTE: indemnizaciones o agravamientos adicionales si correspondieren, verificando previamente su vigencia normativa], con más sus intereses, costas y todo otro concepto que en derecho corresponda.

Hago expresa reserva de iniciar las acciones administrativas y judiciales pertinentes y de formular las denuncias del caso ante los organismos fiscales, de la seguridad social y la autoridad administrativa del trabajo.

A todo evento, constituyo domicilio en {{cliente_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, donde serán válidas todas las comunicaciones que deba cursarme con motivo de la presente. La presente se remite al amparo de la gratuidad que garantizan al trabajador el art. 20 LCT y la ley 23.789.

QUEDA UD. DEBIDAMENTE NOTIFICADO.

{{cliente_nombre}}
DNI N.º {{cliente_documento}}$tpl$, updated_at = now() where id = '2e59b8fd-a87b-47fd-b12e-cb6ed24ae72a' and estudio_id is null;

update public.plantillas set nombre = 'Demanda ordinaria — Daños y perjuicios', tipo = 'Demanda', categoria = 'demanda', fuero = 'civil_comercial', descripcion = 'Demanda de daños y perjuicios por juicio ordinario civil (CPCC Córdoba, ley 8465), con presupuestos de responsabilidad del CCCN, rubros indemnizatorios y prueba completa', orden = 20, variables = ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','contraparte_nombre','contraparte_documento','contraparte_domicilio','monto_letras','monto','fecha_hecho','lugar_hecho','monto_dano_emergente','monto_lucro_cesante','monto_dano_moral']::text[], contenido = $tpl$PROMUEVE DEMANDA ORDINARIA DE DAÑOS Y PERJUICIOS

{{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{cliente_domicilio}}, con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por la presente a promover formal demanda ordinaria de daños y perjuicios en contra de {{contraparte_nombre}}, DNI/CUIT N.º {{contraparte_documento}}, con domicilio en {{contraparte_domicilio}}, tendiente al cobro de la suma de pesos {{monto_letras}} ($ {{monto}}) o lo que en más o en menos resulte de la prueba a rendir y considere el Tribunal de mérito, con más los intereses devengados desde que se produjo cada perjuicio (art. 1748 CCCN) y hasta su efectivo pago, y costas, conforme a los hechos y el derecho que seguidamente expongo.

[PENDIENTE: acreditar el cumplimiento de la etapa de mediación prejudicial obligatoria (ley 10.543), acompañando el acta de cierre respectiva, o fundar la causal de exclusión o excepción que corresponda].

II. HECHOS.

[PENDIENTE: relatar cronológicamente los hechos, precisando circunstancias de tiempo ({{fecha_hecho}}), lugar ({{lugar_hecho}}) y modo en que se produjo el hecho dañoso; la intervención que cupo a la parte demandada; las consecuencias inmediatas y mediatas sufridas por la parte actora; y los reclamos extrajudiciales efectuados con su resultado].

Pese a las gestiones extrajudiciales realizadas, la parte demandada no ha asumido la reparación de los daños ocasionados, lo que obliga a mi parte a ocurrir por esta vía judicial en procura del reconocimiento de su derecho.

III. RESPONSABILIDAD.

La pretensión que se deduce encuentra sustento en la concurrencia, en el caso, de todos los presupuestos de la responsabilidad civil que estructura el Código Civil y Comercial de la Nación (ley 26.994), conforme se desarrolla a continuación.

A. ANTIJURIDICIDAD. La violación del deber de no dañar a otro da lugar a la reparación del daño causado (art. 1716 CCCN). Conforme el art. 1717 CCCN, cualquier acción u omisión que causa un daño a otro es antijurídica si no está justificada. En el caso, la conducta de la demandada importó la transgresión del principio alterum non laedere, de raigambre constitucional (art. 19 CN), sin que concurra causa de justificación alguna. [PENDIENTE: precisar la conducta antijurídica concreta atribuida a la demandada y, en su caso, las normas específicas infringidas].

B. DAÑO. Hay daño cuando se lesiona un derecho o un interés no reprobado por el ordenamiento jurídico, que tenga por objeto la persona, el patrimonio, o un derecho de incidencia colectiva (art. 1737 CCCN). La indemnización comprende la pérdida o disminución del patrimonio de la víctima, el lucro cesante y la pérdida de chances, e incluye especialmente las consecuencias de la violación de los derechos personalísimos de la víctima, de su integridad personal, su salud psicofísica, sus afecciones espirituales legítimas y las que resultan de la interferencia en su proyecto de vida (art. 1738 CCCN). Los perjuicios que aquí se reclaman son ciertos, personales y subsistentes, y resultan de la lesión de un interés propio de la parte actora (art. 1739 CCCN). [PENDIENTE: describir los daños concretamente sufridos y su vinculación con el hecho].

C. NEXO DE CAUSALIDAD. Existe relación de causalidad adecuada entre el hecho atribuido a la demandada y los daños cuya reparación se reclama, pues son resarcibles las consecuencias dañosas que tienen nexo adecuado de causalidad con el hecho productor del daño, indemnizándose las consecuencias inmediatas y las mediatas previsibles (arts. 1726 y 1727 CCCN). [PENDIENTE: explicar por qué los daños reclamados son consecuencia adecuada del hecho atribuido a la demandada].

D. FACTOR DE ATRIBUCIÓN. La atribución de un daño al responsable puede sustentarse en factores objetivos o subjetivos (art. 1721 CCCN). [PENDIENTE: precisar y fundar el factor de atribución aplicable al caso: subjetivo —culpa o dolo, art. 1724 CCCN— u objetivo —p. ej., riesgo o vicio de la cosa o actividad riesgosa o peligrosa, arts. 1722, 1757 y 1758 CCCN, con identificación del dueño o guardián—].

Concurrentes los presupuestos reseñados, nace en cabeza de la demandada la obligación de reparar el daño causado, reparación que debe ser plena, restituyendo la situación del damnificado al estado anterior al hecho dañoso (art. 1740 CCCN).

IV. RUBROS RECLAMADOS.

Conforme los hechos relatados y los presupuestos de responsabilidad desarrollados, se reclaman los siguientes rubros indemnizatorios:

1. DAÑO EMERGENTE. Comprende la pérdida o disminución patrimonial efectivamente sufrida por la parte actora como consecuencia del hecho dañoso (art. 1738 CCCN). [PENDIENTE: detallar las erogaciones y pérdidas patrimoniales sufridas —gastos de reparación, gastos médicos y de farmacia, traslados, etc.—, con remisión a los comprobantes que se acompañan]. Por este rubro se reclama la suma de $ {{monto_dano_emergente}}, o lo que en más o en menos resulte de la prueba.

2. LUCRO CESANTE. Comprende el beneficio económico esperado de acuerdo a la probabilidad objetiva de su obtención, del que se vio privada la parte actora a raíz del hecho (art. 1738 CCCN). [PENDIENTE: precisar las ganancias dejadas de percibir, el período comprendido y las bases de cálculo]. Por este rubro se reclama la suma de $ {{monto_lucro_cesante}}, o lo que en más o en menos resulte de la prueba.

3. DAÑO MORAL (CONSECUENCIAS NO PATRIMONIALES). Se reclama la indemnización de las consecuencias no patrimoniales sufridas por la parte actora (art. 1741 CCCN). El daño moral importa una minoración en la subjetividad de la persona derivada de la lesión a un interés no patrimonial: una modificación disvaliosa del espíritu en el desenvolvimiento de su capacidad de entender, querer o sentir, que se traduce en un modo de estar diferente de aquel en que se hallaba antes del hecho, como consecuencia de éste y anímicamente perjudicial. En el caso, el hecho dañoso provocó en la parte actora padecimientos, angustias y alteraciones en su vida de relación que exceden las molestias ordinarias y merecen reparación. [PENDIENTE: describir los padecimientos espirituales concretos sufridos por la parte actora y su repercusión en su vida cotidiana y de relación]. En cuanto a su cuantificación, el art. 1741 in fine CCCN dispone que el monto de la indemnización debe fijarse ponderando las satisfacciones sustitutivas y compensatorias que pueden procurar las sumas reconocidas. [PENDIENTE: indicar el placer o satisfacción sustitutiva elegido como parámetro de cuantificación —p. ej., un viaje, un bien de uso o esparcimiento— y su valor de mercado, acompañando presupuestos si se cuenta con ellos]. Por este rubro se reclama la suma de $ {{monto_dano_moral}}, o lo que en más o en menos estime V.S.

4. [PENDIENTE: agregar, si corresponden, otros rubros: pérdida de chance, incapacidad sobreviniente (art. 1746 CCCN), daño psicológico y costo de tratamiento, gastos futuros, privación de uso, desvalorización venal; o suprimir este punto].

El total reclamado asciende a la suma de pesos {{monto_letras}} ($ {{monto}}), o lo que en más o en menos resulte de la prueba a rendirse, con más intereses desde que se produjo cada perjuicio (art. 1748 CCCN) y hasta el efectivo pago. [PENDIENTE: precisar la tasa de interés solicitada conforme la doctrina judicial vigente del Tribunal Superior de Justicia de Córdoba].

V. PRUEBA.

Ofrezco la siguiente prueba, sin perjuicio de la facultad de mi parte de ampliarla o ratificarla en la oportunidad procesal correspondiente:

1. DOCUMENTAL:

A. [PENDIENTE: acta de cierre de la mediación prejudicial obligatoria, si corresponde].

B. [PENDIENTE: documental que acredita el hecho dañoso —actas, constancias, fotografías, denuncias, historia clínica, etc.—].

C. [PENDIENTE: comprobantes, facturas y presupuestos que acreditan los rubros reclamados].

D. [PENDIENTE: demás documental relacionada con la presente causa].

2. INFORMATIVA: Se libren oficios a [PENDIENTE: indicar entidades públicas o privadas a oficiar y los puntos sobre los que deberán informar, en relación con el hecho y los rubros reclamados].

3. CONFESIONAL: Se cite a la parte demandada a absolver posiciones a tenor del pliego que oportunamente se acompañará, bajo apercibimiento de ley.

4. TESTIMONIAL: Se cite a prestar declaración testimonial a las siguientes personas: [PENDIENTE: nombre completo, DNI y domicilio de cada testigo], a tenor del interrogatorio que oportunamente se acompañará.

5. PERICIAL: Se designe perito oficial [PENDIENTE: indicar especialidad: médica, psicológica, mecánica, contable, ingeniería, etc.] para que, previa aceptación del cargo, dictamine sobre los siguientes puntos: [PENDIENTE: detallar los puntos de pericia]. Hago reserva de proponer perito de control por mi parte.

6. EXHIBICIÓN - RECONOCIMIENTO: Se intime a la parte demandada a reconocer la documental que se le atribuye y a exhibir [PENDIENTE: documentación en poder de la demandada cuya exhibición se requiere, o suprimir este punto].

VI. DERECHO.

Fundo el derecho que asiste a mi parte en lo dispuesto por el art. 19 de la Constitución Nacional; los arts. 1716, 1717, 1721, 1722, 1724, 1726, 1727, 1737, 1738, 1739, 1740, 1741 y 1748 del Código Civil y Comercial de la Nación (ley 26.994); los arts. 175 y concordantes del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465); y demás normativa, doctrina y jurisprudencia aplicables al caso.

VII. JURISPRUDENCIA.

[PENDIENTE: citar jurisprudencia aplicable sobre los presupuestos de la responsabilidad civil, la procedencia y cuantificación de los rubros reclamados —en especial daño moral y satisfacciones sustitutivas del art. 1741 in fine CCCN— y la tasa de interés aplicable en el fuero civil y comercial de Córdoba].

VIII. RESERVA DEL CASO FEDERAL.

Para el hipotético e improbable supuesto de que no se hiciera lugar a la pretensión deducida, dejo formulada expresa reserva del caso federal en los términos del art. 14 de la ley 48, por encontrarse comprometidas garantías de raigambre constitucional, en especial el derecho de propiedad, el debido proceso, la defensa en juicio y el principio de reparación plena (arts. 17, 18 y 19 de la Constitución Nacional), a fin de ocurrir oportunamente por ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario.

IX. SOLICITA REGULACIÓN DE HONORARIOS.

Solicito se regulen los honorarios profesionales del letrado interviniente correspondientes a la apertura de carpeta, conforme lo dispuesto por el art. 104 inc. 5 de la ley 9459.

X. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, por parte y con el domicilio legal constituido.

2. Tenga por interpuesta en tiempo y forma la demanda incoada.

3. Imprima a la presente el trámite de juicio ordinario, y cite y emplace a la parte demandada para que comparezca a estar a derecho y conteste la demanda en los términos de ley, bajo apercibimiento.

4. Tenga presente la prueba ofrecida para su oportunidad procesal.

5. Tenga presente la reserva del caso federal formulada.

6. Regule los honorarios profesionales por apertura de carpeta (art. 104 inc. 5, ley 9459).

7. Oportunamente al resolver, haga lugar a la demanda en todas sus partes, condenando a la parte demandada a abonar la suma reclamada o la que en más o en menos resulte de la prueba, con más intereses, con expresa imposición de costas a la parte demandada.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$, updated_at = now() where id = '1090f62c-e76a-4dda-99fa-78cb46098354' and estudio_id is null;

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000002', null, 'global', 'Demanda ejecutiva', 'Demanda', 'demanda', 'civil_comercial', 'Demanda de juicio ejecutivo por pagaré o cheque (arts. 517 y ss. CPCC Córdoba), con pedido de despacho de ejecución, citación de comparendo y de remate y embargo sobre bienes del demandado', 30, ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','contraparte_nombre','contraparte_documento','contraparte_domicilio','monto_letras','monto','titulo_tipo','localidad','titulo_fecha_libramiento','titulo_fecha_vencimiento','titulo_lugar_pago','monto_intereses_costas_letras','monto_intereses_costas']::text[], $tpl$SR. JUEZ DE PRIMERA INSTANCIA EN LO CIVIL Y COMERCIAL [PENDIENTE: nominación y sede que correspondan; en la presentación por el portal de Demandas Electrónicas la asignación del tribunal se efectúa por sorteo].

PROMUEVE DEMANDA EJECUTIVA. SOLICITA EMBARGO.

{{cliente_nombre}}, D.N.I. N° {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{cliente_domicilio}}, con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por la presente a promover formal demanda ejecutiva en contra de {{contraparte_nombre}}, D.N.I./CUIT N° {{contraparte_documento}}, con domicilio en {{contraparte_domicilio}}, persiguiendo el cobro de la suma líquida de pesos {{monto_letras}} ($ {{monto}}) que surge del título que trae aparejada ejecución que se acompaña, con más sus intereses y las costas del juicio, conforme a los hechos y el derecho que seguidamente expongo, solicitando a V.S. que despache ejecución en contra del demandado y, oportunamente, mande llevar adelante la ejecución hasta el completo pago de lo adeudado.

II. EL TÍTULO.

El demandado adeuda a mi parte la suma de pesos {{monto_letras}} ($ {{monto}}), instrumentada en {{titulo_tipo}} librado en {{localidad}} con fecha {{titulo_fecha_libramiento}}, por la suma indicada, con vencimiento el día {{titulo_fecha_vencimiento}} y lugar de pago en {{titulo_lugar_pago}}, cuyo original obra en poder de mi parte y se acompaña al presente.

[PENDIENTE: completar la descripción del título según su clase. Si se trata de un pagaré: consignar nombre del librador y del beneficiario, existencia de cláusula "sin protesto", y si el documento circuló por endoso. Si se trata de un cheque: consignar banco girado, sucursal, número de cuenta corriente, número de cheque, fecha de presentación al cobro y constancia de rechazo asentada por el banco girado, con su fecha y causal. Si se trata de otro título ejecutivo de los admitidos por los arts. 517 y 518 del CPCC (instrumento público, instrumento privado reconocido judicialmente o declarado tal, u otro título al que la ley acuerde fuerza ejecutiva): describirlo y adecuar las referencias cambiarias de esta plantilla.]

Llegado el vencimiento, y no obstante las gestiones de cobro realizadas [PENDIENTE: detallar gestiones extrajudiciales de cobro, si las hubo, o suprimir la referencia], el demandado no abonó suma alguna, encontrándose en mora. La deuda reclamada es, en consecuencia, líquida, exigible y de plazo vencido, y consta en un título de los que traen aparejada ejecución en los términos de los arts. 517 y 518 del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465).

Destaco que, tratándose de un título cambiario abstracto, completo y autosuficiente, su sola presentación habilita la vía ejecutiva intentada, sin que corresponda indagar en la causa de la obligación, cuya discusión resulta ajena al estrecho marco cognoscitivo del juicio ejecutivo. [PENDIENTE: suprimir este párrafo si el título ejecutado no fuera cambiario. Asimismo, verificar si la relación subyacente es de consumo: tratándose de pagaré o cheque librado en una relación de consumo, la doctrina judicial consolidada admite la verificación oficiosa de esa relación y la integración del título con la documentación causal (art. 36, ley 24.240), en cuyo caso deberá adecuarse la demanda a la doctrina del pagaré de consumo.]

Se reclaman asimismo los intereses moratorios devengados desde la mora y hasta el día del efectivo pago, a la tasa de [PENDIENTE: indicar la tasa de interés solicitada; es de uso en el fuero la tasa pasiva promedio que publica el B.C.R.A. con más un componente nominal mensual, a validar según el criterio vigente del tribunal].

El título se acompaña en copia digitalizada a través del portal de presentaciones electrónicas, dejándose su original reservado en [PENDIENTE: indicar reserva del original en secretaría del tribunal o en poder del letrado, conforme la reglamentación vigente del TSJ sobre expediente electrónico, y ofrecerlo para su compulsa cuando el Tribunal lo requiera].

III. COMPETENCIA.

V.S. resulta competente para entender en la presente causa en razón de [PENDIENTE: indicar el criterio atributivo de competencia: lugar de pago designado en el título, domicilio del demandado o prórroga de competencia pactada], de conformidad con las reglas del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465).

IV. EMBARGO.

Solicito a V.S. que, al despachar la ejecución y de conformidad con lo dispuesto por el art. 526 del CPCC (ley 8465), ordene trabar embargo sobre bienes del demandado suficientes para cubrir la suma reclamada de pesos {{monto_letras}} ($ {{monto}}), con más la suma de pesos {{monto_intereses_costas_letras}} ($ {{monto_intereses_costas}}) que se presupuesta provisoriamente para responder a intereses y costas del juicio.

A tal fin, indico los siguientes bienes sobre los que solicito la traba de la medida: [PENDIENTE: individualizar los bienes a embargar: inmuebles o automotores con sus datos registrales, fondos y valores depositados en entidades financieras, haberes que perciba el demandado con indicación de su empleador, créditos u otros bienes], solicitando se libren los oficios y/o mandamientos pertinentes para su traba y anotación.

Hago presente que, tratándose del embargo propio del despacho de ejecución (art. 526 del CPCC), accesorio de éste y consecuencia directa de la presentación de un título que trae aparejada ejecución, su traba no se encuentra supeditada a la acreditación de los recaudos propios de las medidas cautelares genéricas ni a la prestación de contracautela.

V. DOCUMENTAL.

Sin perjuicio de que en el juicio ejecutivo la oportunidad probatoria de mi parte recién se abrirá, en su caso, al contestar las excepciones que pudiera oponer el demandado, acompaño la siguiente documental:

A. El título base de la acción descripto en el punto II del presente: {{titulo_tipo}} librado con fecha {{titulo_fecha_libramiento}} por la suma de $ {{monto}}, con vencimiento el día {{titulo_fecha_vencimiento}}.

B. [PENDIENTE: demás documental acompañada: constancia de rechazo bancario si el título es un cheque, intimaciones extrajudiciales de pago, u otra documentación pertinente; suprimir este acápite si no la hubiere.]

VI. TASA DE JUSTICIA Y APORTES.

En cumplimiento de las cargas fiscales y previsionales que gravan la promoción de la presente demanda, manifiesto que [PENDIENTE: indicar lo que corresponda: que se acompañan los comprobantes de pago de la tasa de justicia y de los aportes previsionales (Caja de Previsión y Seguridad Social de Abogados y Procuradores de la Provincia de Córdoba) y colegiales de ley, o que se solicita su diferimiento conforme la normativa vigente].

VII. DERECHO.

Fundo el derecho que asiste a mi parte en los arts. 517, 518, 526 y concordantes del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465); en el régimen aplicable al título que se ejecuta [PENDIENTE: ajustar la cita normativa según el título: decreto ley 5965/63 en materia de letra de cambio y pagaré, ley 24.452 en materia de cheques, verificando los artículos específicos aplicables, o el régimen propio del título ejecutivo no cambiario de que se trate]; en los arts. 730 y 768 del Código Civil y Comercial de la Nación (ley 26.994) en cuanto a los efectos de las obligaciones y los intereses moratorios; y en el art. 130 del CPCC en materia de costas; doctrina y jurisprudencia concordantes.

VIII. JURISPRUDENCIA.

[PENDIENTE: citar jurisprudencia aplicable sobre la habilidad del título ejecutivo, la abstracción cambiaria y la improcedencia de discutir la causa de la obligación en el juicio ejecutivo; en su caso, sobre la doctrina del pagaré de consumo.]

IX. RESERVA DEL CASO FEDERAL.

Para el hipotético e improbable supuesto de que no se hiciera lugar a la demanda en la forma planteada, dejo formulada expresa reserva de ocurrir ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario federal previsto en el art. 14 de la ley 48, por encontrarse comprometidos los derechos y garantías de propiedad, defensa en juicio y debido proceso consagrados por los arts. 17 y 18 de la Constitución Nacional.

X. SOLICITA REGULACIÓN DE HONORARIOS. ART. 104 INC. 5, LEY 9459.

Atento al inicio de la presente causa, solicito se regulen a favor del letrado {{abogado}}, M.P. {{matricula}}, los honorarios previstos por el art. 104 inc. 5 del Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba (ley 9459), correspondientes a la apertura de carpeta.

XI. PETITUM.

Por todo lo expuesto, a V.S. solicito:

1. Me tenga por presentado, por parte y con los domicilios procesal y electrónico constituidos.

2. Tenga por interpuesta en tiempo y forma la demanda ejecutiva incoada y por acompañado el título base de la acción.

3. Tenga presente lo manifestado respecto de la tasa de justicia y de los aportes previsionales y colegiales.

4. Despache ejecución en contra de {{contraparte_nombre}} por la suma de pesos {{monto_letras}} ($ {{monto}}), con más sus intereses y costas.

5. Cite al demandado de comparendo y de remate para que comparezca a estar a derecho y oponga excepciones legítimas en los plazos de ley, bajo apercibimiento de mandar llevar adelante la ejecución (art. 526 del CPCC).

6. Ordene trabar el embargo solicitado en el punto IV del presente, librándose los oficios y/o mandamientos pertinentes para su traba y anotación.

7. Regule los honorarios por apertura de carpeta conforme al art. 104 inc. 5 de la ley 9459.

8. Tenga presente la reserva del caso federal formulada.

9. Oportunamente al resolver, dicte sentencia mandando llevar adelante la ejecución en contra de la parte demandada hasta el completo pago del capital reclamado de pesos {{monto_letras}} ($ {{monto}}), con más sus intereses y las costas del juicio, con expresa imposición de costas a la parte demandada.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000008', null, 'global', 'Solicita prórroga de plazo', 'Escrito', 'escrito', null, 'Escrito breve para pedir la prórroga o suspensión de un plazo procesal antes de su vencimiento, utilizable en cualquier fuero', 20, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','acto_procesal','fecha_vencimiento','plazo_solicitado']::text[], $tpl$SOLICITA PRÓRROGA DE PLAZO

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante] de {{cliente_nombre}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por el presente a solicitar a V.S. se sirva conceder una prórroga del plazo acordado para {{acto_procesal}}, cuyo vencimiento opera el día {{fecha_vencimiento}}, por el término de {{plazo_solicitado}} días hábiles o por el que V.S. estime prudente fijar, conforme a las razones de hecho y de derecho que seguidamente expongo.

II. FUNDAMENTO DEL PEDIDO.

El pedido de prórroga que se formula obedece a las siguientes razones: [PENDIENTE: fundar el pedido — exponer en forma concreta y circunstanciada el motivo que impide cumplir el acto dentro del plazo originario (p. ej., complejidad del asunto, demora en la obtención de documentación o informes en poder de terceros, razones de salud debidamente acreditadas, caso fortuito o fuerza mayor), acompañando u ofreciendo la prueba que respalde lo invocado].

Dejo expresamente manifestado que el presente pedido se formula con anterioridad al vencimiento del plazo cuya prórroga se solicita, que no responde a un propósito dilatorio sino a la necesidad de resguardar el adecuado ejercicio del derecho de defensa de mi parte, y que su concesión no ocasiona perjuicio alguno a la contraparte ni a la marcha regular del proceso, por lo que median razones suficientes para hacer lugar a lo peticionado.

[PENDIENTE: si el plazo en cuestión fuera fatal o improrrogable según el ordenamiento procesal aplicable, evaluar la viabilidad del pedido y, en su caso, reencauzarlo como solicitud de suspensión del plazo o de fijación de uno nuevo, invocando las circunstancias excepcionales que lo justifiquen].

III. DERECHO.

Fundo la presente petición en las normas que regulan los plazos procesales en el ordenamiento aplicable a este proceso [PENDIENTE: verificar norma y artículo según el fuero: CPCC de Córdoba ley 8465 en lo civil y comercial, Ley Procesal del Trabajo ley 7987 en lo laboral, o el régimen procesal que corresponda], en los principios de buena fe y colaboración procesal, en la garantía de defensa en juicio consagrada por el art. 18 de la Constitución Nacional y en las facultades ordenatorias propias del Tribunal.

IV. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado en el carácter invocado y por formuladas las manifestaciones que anteceden.

2. Tenga presente que el presente pedido se formula con anterioridad al vencimiento del plazo en cuestión.

3. Conceda la prórroga del plazo para {{acto_procesal}} por el término de {{plazo_solicitado}} días hábiles, o por el que V.S. estime corresponder, a computarse desde el vencimiento del plazo originario [PENDIENTE: o desde la notificación del proveído que la conceda, según corresponda].

4. En subsidio, y para el caso de que V.S. entienda que la prórroga no resulta procedente, disponga la suspensión del plazo por el término que estime prudente, en mérito de las mismas razones invocadas.

Proveer de conformidad.
SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

update public.plantillas set nombre = 'Oficio judicial', tipo = 'Oficio', categoria = 'oficio', fuero = null, descripcion = 'Oficio informativo dirigido a entidades públicas o privadas para requerir informes ordenados por el tribunal en una causa, apto para cualquier fuero', orden = 10, variables = ARRAY['localidad','fecha','expediente_caratula','nro_sac','juzgado','secretaria','fuero','abogado','matricula','estudio_domicilio','domicilio_electronico','plazo_dias']::text[], contenido = $tpl$OFICIO

{{localidad}}, {{fecha}}.

SEÑOR/A TITULAR O RESPONSABLE LEGAL DE
[PENDIENTE: denominación completa de la entidad pública o privada destinataria]
[PENDIENTE: domicilio de la entidad destinataria]
S__________/__________D

Ref.: Autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, fuero {{fuero}}.

De mi mayor consideración:

El/la que suscribe, {{abogado}}, M.P. {{matricula}}, con domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, en mi carácter de letrado/a autorizado/a para el diligenciamiento del presente, tengo el agrado de dirigirme a Ud. en los autos de la referencia, a fin de requerir a la entidad a su cargo que evacúe el informe que se detalla en el punto II del presente, en el marco de la prueba informativa ordenada en la causa (arts. 317 y siguientes del Código Procesal Civil y Comercial de la Provincia de Córdoba, ley 8465) [PENDIENTE: si la causa tramita ante el fuero laboral, citar además la Ley Procesal del Trabajo de Córdoba, ley 7987, y verificar la norma de remisión aplicable].

I. PROVEÍDO QUE ORDENA EL LIBRAMIENTO.

El presente oficio se libra por orden del Tribunal interviniente, conforme al decreto cuya parte pertinente se transcribe a continuación: “[PENDIENTE: transcribir textualmente el proveído que ordena el libramiento del oficio, con su fecha y la firma del magistrado y/o funcionario interviniente]”.

II. PUNTOS A INFORMAR.

Conforme a lo ordenado, se solicita que la entidad a su cargo informe al Tribunal oficiante, con remisión de copia certificada de la documentación respaldatoria cuando correspondiere, sobre los siguientes puntos:

1. [PENDIENTE: primer punto a informar, redactado en forma clara, precisa y autosuficiente].

2. [PENDIENTE: segundo punto a informar].

3. [PENDIENTE: agregar o suprimir puntos según corresponda; los puntos deben coincidir exactamente con los admitidos por el Tribunal en el proveído transcripto].

III. PLAZO PARA CONTESTAR.

El informe requerido deberá ser evacuado dentro del plazo de {{plazo_dias}} días hábiles de recibido el presente, o el que se hubiere fijado en el proveído transcripto, bajo apercibimiento de ley. Se deja constancia de que la demora, la omisión o la falsedad injustificadas en la contestación podrán dar lugar a las responsabilidades previstas por la legislación procesal y de fondo aplicable [PENDIENTE: verificar norma y artículo del régimen de prueba informativa aplicable al fuero de la causa].

[PENDIENTE: si corresponde —p. ej., causa laboral alcanzada por el beneficio de gratuidad del trabajador (art. 20 LCT) o beneficio de litigar sin gastos—, dejar constancia expresa de que el presente se libra sin cargo].

IV. FORMA DE REMISIÓN DE LA RESPUESTA.

La contestación deberá dirigirse a {{juzgado}}, {{secretaria}}, con expresa indicación de la carátula y del número de expediente consignados en la referencia. Podrá remitirse por los canales electrónicos habilitados por el Poder Judicial de Córdoba [PENDIENTE: indicar el correo electrónico oficial del tribunal o el medio de presentación electrónica dispuesto en el proveído] o, en su caso, en soporte papel en la sede del Tribunal oficiante, sita en [PENDIENTE: domicilio del tribunal oficiante].

V. AUTORIZACIÓN DE DILIGENCIAMIENTO.

Se encuentra autorizado/a para el diligenciamiento del presente oficio, su presentación ante la entidad destinataria, el retiro de su contestación y la realización de toda otra gestión conducente, el/la letrado/a {{abogado}}, M.P. {{matricula}}, conforme surge del proveído transcripto [PENDIENTE: agregar otras personas autorizadas, si las hubiere].

Sin otro particular, saludo a Ud. atentamente.

{{abogado}}
M.P. {{matricula}}
Letrado/a autorizado/a$tpl$, updated_at = now() where id = '1f073acf-82cd-4e90-a810-8ec2b62e2fcf' and estudio_id is null;

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000003', null, 'global', 'Demanda de desalojo', 'Demanda', 'demanda', 'civil_comercial', 'Demanda de desalojo por falta de pago o vencimiento de contrato, con pedido de lanzamiento, para el fuero civil y comercial de Córdoba', 40, ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','contraparte_nombre','contraparte_documento','contraparte_domicilio','inmueble_direccion','localidad','contrato_fecha','contrato_plazo','contrato_vencimiento','destino_locacion','canon_monto_letras','canon_monto','periodos_adeudados','fecha_intimacion']::text[], $tpl$PROMUEVE DEMANDA DE DESALOJO

{{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{cliente_domicilio}}, con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por la presente a promover formal demanda de desalojo en contra de {{contraparte_nombre}}, DNI N.º {{contraparte_documento}}, con domicilio en {{contraparte_domicilio}}, y/o en contra de cualquier otro subinquilino, tenedor precario, intruso u ocupante cuya obligación de restituir sea exigible, tendiente a obtener la desocupación y restitución del inmueble ubicado en {{inmueble_direccion}}, de la localidad de {{localidad}}, [PENDIENTE: datos complementarios de identificación del inmueble: designación catastral y/o matrícula del Registro General, si se cuenta con ellos], libre de personas y de cosas, bajo apercibimiento de lanzamiento, con expresa imposición de costas a la parte demandada, conforme a los hechos y el derecho que seguidamente expongo.

Dejo formulada expresa reserva de reclamar, por la vía y forma que corresponda, los cánones locativos, accesorios y demás rubros adeudados, como así también los daños y perjuicios derivados del incumplimiento contractual.

II. HECHOS.

1. El contrato de locación. Con fecha {{contrato_fecha}} celebré con la parte demandada un contrato de locación respecto del inmueble ubicado en {{inmueble_direccion}}, por el plazo de {{contrato_plazo}}, con vencimiento el día {{contrato_vencimiento}}, conforme surge del instrumento que se acompaña como prueba documental. [PENDIENTE: indicar si el contrato se celebró por instrumento privado o público, si existieron garantes o fianzas y toda otra modalidad relevante de la contratación].

2. El destino y el canon. El inmueble fue entregado a la parte demandada con destino {{destino_locacion}} [PENDIENTE: precisar el destino convenido: habitacional, comercial u otro], pactándose un canon locativo mensual que asciende a la suma de pesos {{canon_monto_letras}} ($ {{canon_monto}}), pagadero [PENDIENTE: modalidad, lugar y fecha de pago convenidos, y mecanismo de ajuste pactado, si existiere].

3. La causal de desalojo. [PENDIENTE: conservar únicamente la alternativa A o B según la causal invocada y suprimir la restante, adecuando la numeración].

A. Falta de pago (art. 1219 inc. c del CCCN). La parte demandada adeuda los cánones locativos correspondientes a los períodos {{periodos_adeudados}}, configurándose la falta de pago de la prestación dineraria convenida durante dos períodos consecutivos. [PENDIENTE: detallar los períodos impagos, sus montos y las gestiones de cobro realizadas]. Con fecha {{fecha_intimacion}} intimé fehacientemente a la parte demandada al pago de las sumas adeudadas mediante [PENDIENTE: carta documento u otro medio fehaciente, con indicación de número de pieza postal y resultado], otorgando el plazo legal y consignando el lugar de pago, sin que la deuda fuera cancelada ni el inmueble restituido. [PENDIENTE: si el destino es habitacional, verificar y acreditar el cumplimiento de la intimación previa exigida por el art. 1222 del CCCN].

B. Vencimiento del contrato (art. 1217 del CCCN). El plazo contractual venció el día {{contrato_vencimiento}}, encontrándose extinguida la locación y siendo plenamente exigible la obligación de restituir la tenencia del inmueble (arts. 1210 y 1223 del CCCN). No obstante ello, y pese a haber sido requerida fehacientemente la devolución del inmueble mediante [PENDIENTE: detalle del requerimiento de restitución: medio empleado, fecha y resultado], la parte demandada continúa ocupándolo sin título ni derecho alguno que justifique su permanencia.

4. La persistencia en la ocupación. Pese a las gestiones e intimaciones referidas, la parte demandada persiste en la ocupación del inmueble y se niega a restituirlo, lo que torna procedente la presente acción a fin de obtener su desocupación y entrega, libre de personas y de cosas. [PENDIENTE: relatar toda otra circunstancia relevante del caso: estado de ocupación conocido, existencia de subinquilinos u ocupantes, tratativas extrajudiciales].

III. PROCEDENCIA DE LA ACCIÓN.

La legitimación activa surge de mi carácter de [PENDIENTE: locador / propietario / poseedor / sucesor a título universal o singular] del inmueble objeto de autos, conforme la documental que se acompaña. La legitimación pasiva alcanza a la parte demandada en su carácter de locataria, y se extiende a todo subinquilino, tenedor precario, intruso u ocupante cuya obligación de restituir sea exigible, a cuyo fin solicito que la notificación de la demanda se practique en el inmueble objeto del juicio y se haga extensiva a quienes se encuentren ocupándolo.

La obligación de restituir el inmueble se encuentra vencida y es plenamente exigible conforme la causal invocada y los hechos relatados, sin que asista a la parte demandada título ni derecho alguno que justifique la continuidad de la ocupación. Concurren, en consecuencia, todos los presupuestos de procedencia de la acción de desalojo intentada.

IV. PRUEBA.

Ofrezco la siguiente prueba:

1. DOCUMENTAL:

A. Contrato de locación de fecha {{contrato_fecha}}, celebrado entre las partes respecto del inmueble ubicado en {{inmueble_direccion}}.

B. [PENDIENTE: intimaciones y comunicaciones fehacientes cursadas: cartas documento o telegramas, con sus constancias de imposición y entrega].

C. [PENDIENTE: documental que acredite la legitimación activa: escritura, informe de matrícula, boleto de compraventa u otro título, según el caso].

D. [PENDIENTE: recibos, constancias de pago, comunicaciones entre las partes y toda otra documental relevante].

2. INFORMATIVA: Solicito se libre oficio:

A. Al Correo Argentino S.A. y/o a la empresa postal que corresponda, a fin de que informe sobre la autenticidad, contenido, fecha de imposición y entrega de las piezas postales acompañadas.

B. [PENDIENTE: al Registro General de la Provincia u otros organismos públicos o privados, si resulta pertinente para acreditar la titularidad del inmueble u otros extremos invocados].

3. CONFESIONAL: Solicito se cite a la parte demandada a absolver posiciones a tenor del pliego que oportunamente se acompañará, bajo apercibimiento de ley.

4. TESTIMONIAL: Solicito se cite a prestar declaración testimonial a las siguientes personas: [PENDIENTE: nombre completo, DNI y domicilio de cada testigo], quienes depondrán a tenor del interrogatorio que oportunamente se acompañará.

V. DERECHO.

Fundo la presente demanda en lo dispuesto por los arts. 1187, 1208, 1210, 1217, 1218, 1219, 1222 y 1223 y concordantes del Código Civil y Comercial de la Nación (ley 26.994), en los arts. 750 y siguientes del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465) y en las demás normas concordantes y complementarias que V.S. supla en virtud del principio iura novit curia. [PENDIENTE: verificar la vigencia y redacción actual de las normas citadas en materia de locaciones a la fecha de presentación, atento las sucesivas reformas legislativas en la materia].

VI. JURISPRUDENCIA.

[PENDIENTE: citar jurisprudencia aplicable sobre la procedencia del desalojo por la causal invocada (falta de pago o vencimiento de contrato) en el fuero civil y comercial de Córdoba].

VII. RESERVA DEL CASO FEDERAL.

Para el hipotético e improbable supuesto de que no se hiciera lugar a la presente demanda, formulo expresa reserva de ocurrir ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario federal previsto en el art. 14 de la ley 48, por encontrarse comprometidas las garantías constitucionales de propiedad, defensa en juicio y debido proceso (arts. 17 y 18 de la Constitución Nacional).

VIII. SOLICITA REGULACIÓN DE HONORARIOS.

Solicito se regulen los honorarios profesionales del letrado interviniente correspondientes a la apertura de carpeta, conforme lo dispuesto por el art. 104 inc. 5 de la ley 9459 (Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba).

IX. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, por parte y con el domicilio legal constituido.

2. Tenga por interpuesta en tiempo y forma la demanda de desalojo incoada en contra de {{contraparte_nombre}} y/o de quienes resulten ocupantes del inmueble ubicado en {{inmueble_direccion}}, imprimiéndole el trámite de ley.

3. Tenga por acompañada la prueba documental y por ofrecida la restante prueba.

4. Ordene que la notificación de la demanda se practique en el inmueble objeto del juicio, haciéndola extensiva a los subinquilinos, terceros y demás ocupantes que se encuentren en él.

5. Tenga presente la reserva del caso federal formulada y la solicitud de regulación de honorarios por apertura de carpeta (art. 104 inc. 5 ley 9459).

6. Oportunamente al resolver, haga lugar a la demanda en todas sus partes, condenando a la parte demandada y a todo otro ocupante a desalojar y restituir el inmueble ubicado en {{inmueble_direccion}}, libre de personas y de cosas, dentro del plazo que se fije, bajo apercibimiento de lanzamiento, con expresa imposición de costas a la parte demandada.

Proveer de conformidad.
SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000004', null, 'global', 'Divorcio — presentación conjunta', 'Demanda', 'demanda', 'familia', 'Petición bilateral de divorcio con convenio regulador (arts. 437 a 439 CCCN) para iniciar ante el fuero de familia de Córdoba', 50, ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','conyuge_nombre','conyuge_documento','conyuge_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','fecha_matrimonio','lugar_matrimonio','ultimo_domicilio_conyugal']::text[], $tpl$SOLICITAN DIVORCIO POR PRESENTACIÓN CONJUNTA. ACOMPAÑAN CONVENIO REGULADOR.

{{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{cliente_domicilio}}, y {{conyuge_nombre}}, DNI N.º {{conyuge_documento}}, [PENDIENTE: nacionalidad, edad, estado civil], con domicilio real en {{conyuge_domicilio}}, ambos por derecho propio y con el patrocinio letrado de {{abogado}}, M.P. {{matricula}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparecemos ante V.S. y respetuosamente decimos: [PENDIENTE: si cada cónyuge comparece con patrocinio letrado propio, adecuar la comparecencia y los domicilios constituidos]

I. OBJETO.

Que venimos por la presente, en petición conjunta, a solicitar se decrete el divorcio de los comparecientes en los términos de los arts. 435 inc. c, 437 y 438 del Código Civil y Comercial de la Nación (ley 26.994), y se homologue el convenio regulador de los efectos del divorcio que se incorpora en el apartado III del presente escrito (art. 439 del CCCN), conforme a los hechos y el derecho que seguidamente exponemos.

II. HECHOS.

1. Con fecha {{fecha_matrimonio}} contrajimos matrimonio en {{lugar_matrimonio}}, conforme surge del acta de matrimonio que se acompaña ([PENDIENTE: consignar número de acta, tomo, folio, serie y año, y oficina del Registro Civil]).

2. Fijamos nuestro último domicilio conyugal en {{ultimo_domicilio_conyugal}}, extremo que determina la competencia de V.S. en los términos del art. 717 del CCCN, norma que, tratándose de presentación conjunta, admite asimismo la radicación ante el juez del domicilio de cualquiera de los cónyuges.

3. [PENDIENTE: consignar si de la unión nacieron hijos; en su caso, nombre, DNI y fecha de nacimiento de cada uno, acompañando las respectivas partidas; si son menores de edad o personas con capacidad restringida, dejar constancia a los fines de la intervención del Ministerio Público (art. 103 del CCCN); si no existen hijos, manifestarlo expresamente].

4. [PENDIENTE: relatar brevemente la situación actual de los cónyuges (cese de la convivencia, separación de hecho y su fecha aproximada, si la hubo) y la decisión común, libre e informada de ambos de poner fin al vínculo matrimonial; el divorcio es incausado, por lo que no corresponde invocar ni acreditar causales ni atribuir responsabilidades].

5. [PENDIENTE: denunciar si existen bienes de carácter ganancial y/o propio alcanzados por el convenio regulador, o manifestar expresamente su inexistencia].

III. CONVENIO REGULADOR.

Que, en cumplimiento de lo dispuesto por los arts. 438 y 439 del CCCN, venimos a presentar el siguiente convenio regulador de los efectos del divorcio, celebrado de común acuerdo, el que sometemos a homologación de V.S.:

1. ATRIBUCIÓN DE LA VIVIENDA FAMILIAR: [PENDIENTE: indicar a cuál de los cónyuges se atribuye la vivienda familiar, su ubicación, carácter (propio o ganancial), plazo y condiciones de la atribución, o consignar que el punto no resulta aplicable].

2. EJERCICIO DE LA RESPONSABILIDAD PARENTAL, CUIDADO PERSONAL Y RÉGIMEN COMUNICACIONAL: [PENDIENTE: pactar el ejercicio de la responsabilidad parental respecto de los hijos menores, la modalidad del cuidado personal y el régimen comunicacional con el progenitor no conviviente; si no existen hijos menores de edad ni con capacidad restringida, consignar que el punto no resulta aplicable].

3. PRESTACIÓN ALIMENTARIA: [PENDIENTE: pactar la cuota alimentaria a favor de los hijos (monto o porcentaje de ingresos, forma y fecha de pago, pauta de actualización si se acordó) y, en su caso, los alimentos entre cónyuges; o consignar que el punto no resulta aplicable].

4. DISTRIBUCIÓN DE LOS BIENES: [PENDIENTE: detallar los bienes gananciales y la forma de partición o adjudicación acordada, o manifestar que no existen bienes a distribuir; si la liquidación de la comunidad se difiere para su oportunidad, dejarlo expresamente aclarado].

5. COMPENSACIÓN ECONÓMICA: [PENDIENTE: dejar constancia de lo pactado en materia de compensación económica (arts. 441 y 442 del CCCN), de la reserva de su reclamo por alguno de los cónyuges, o de la manifestación de ambos de que ninguno se considera con derecho a reclamarla].

6. COSTAS Y GASTOS: Las costas de la presente se soportan por el orden causado y los gastos comunes por mitades. [PENDIENTE: ajustar si los cónyuges pactaron otra distribución].

IV. PRUEBA.

Ofrecemos la siguiente prueba:

1. DOCUMENTAL: Se acompaña la siguiente documentación:

A. Acta de matrimonio de los presentantes.

B. Copia de los DNI de ambos cónyuges.

C. [PENDIENTE: partidas de nacimiento de los hijos, si los hubiere].

D. [PENDIENTE: documentación que respalde el convenio regulador (títulos de los bienes, informes registrales, constancias de ingresos, etc.), atento que la propuesta debe acompañarse de los elementos en que se funda (art. 438 del CCCN)].

V. DERECHO.

Fundamos la presente petición en lo dispuesto por los arts. 435 inc. c, 437, 438, 439 y 440 del Código Civil y Comercial de la Nación (ley 26.994); en el art. 717 del mismo cuerpo legal en materia de competencia; en el art. 103 del CCCN en cuanto a la intervención del Ministerio Público respecto de hijos menores de edad o con capacidad restringida, en su caso; y en las disposiciones pertinentes del Código de Procedimiento de Familia de la Provincia de Córdoba, ley 10.305 [PENDIENTE: verificar artículos del CPF aplicables al trámite del divorcio].

[PENDIENTE: citar jurisprudencia aplicable sobre divorcio incausado, presentación conjunta y homologación del convenio regulador, si se estima conveniente].

VI. SOLICITAN REGULACIÓN DE HONORARIOS.

Atento la apertura de carpeta que la presente importa, solicitamos se regulen los honorarios profesionales del letrado patrocinante conforme lo dispuesto por el art. 104 inc. 5 de la ley 9459.

VII. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicitamos:

1. Nos tenga por presentados, por parte, por derecho propio y con el domicilio procesal y electrónico constituidos.

2. Tenga por interpuesta en tiempo y forma la petición conjunta de divorcio y por presentado el convenio regulador de sus efectos (arts. 437, 438 y 439 del CCCN).

3. Tenga por acompañada y ofrecida la prueba documental.

4. Dé intervención al Ministerio Público que por ley corresponda. [PENDIENTE: mantener este punto solo si existen hijos menores de edad o con capacidad restringida (art. 103 del CCCN); en caso contrario, suprimirlo].

5. Oportunamente, decrete el divorcio de los presentantes (arts. 435 inc. c y 437 del CCCN).

6. Homologue en todas sus partes el convenio regulador presentado (arts. 439 y 440 del CCCN).

7. Ordene la anotación marginal de la sentencia en el acta de matrimonio, librándose oficio al Registro del Estado Civil y Capacidad de las Personas que corresponda.

8. Regule los honorarios profesionales del letrado interviniente conforme la ley 9459.

Proveer de conformidad.
SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000005', null, 'global', 'Ofrece prueba', 'Escrito', 'escrito', null, 'Ofrecimiento de prueba dentro del período probatorio, con acápites documental, informativa, confesional, testimonial y pericial, apto para cualquier fuero', 10, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','contraparte_nombre']::text[], $tpl$OFRECE PRUEBA

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante] de {{cliente_nombre}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, comparezco ante V.S. y digo:

I. OBJETO.

Que encontrándose la presente causa abierta a prueba y dentro del plazo legal conferido a tal efecto, vengo en tiempo y forma a ofrecer la prueba de la que intenta valerse esta parte, de conformidad con lo dispuesto por la normativa procesal aplicable al presente proceso ([PENDIENTE: citar norma procesal del fuero: CPCC de Córdoba ley 8465 o Ley Procesal del Trabajo ley 7987, según corresponda]), solicitando a V.S. la tenga por ofrecida, la provea favorablemente y ordene su producción.

II. PRUEBA.

Ofrezco los siguientes medios de prueba:

1. DOCUMENTAL:

Ofrezco como prueba documental la siguiente, cuya plena eficacia probatoria hago valer:

A. [PENDIENTE: individualizar documento 1, indicando si se acompaña en este acto, si fue acompañado al demandar o contestar, o si obra reservado en Secretaría].

B. [PENDIENTE: individualizar documento 2].

C. [PENDIENTE: individualizar documento 3 y agregar los incisos que correspondan].

Asimismo, hago valer toda la documental acompañada por esta parte en oportunidades procesales anteriores y la que obra agregada en autos, en cuanto favorezca a esta parte.

2. INFORMATIVA:

Solicito a V.S. se ordene librar oficios a las siguientes entidades y organismos, a fin de que informen sobre los puntos que en cada caso se indican:

A. [PENDIENTE: entidad u organismo 1, domicilio y puntos concretos sobre los que deberá informar].

B. [PENDIENTE: entidad u organismo 2, domicilio y puntos sobre los que deberá informar].

C. [PENDIENTE: agregar los oficios que correspondan].

Solicito se autorice al suscripto y/o a la persona que éste designe para el diligenciamiento de los oficios que se ordenen librar.

3. CONFESIONAL:

Solicito se cite a {{contraparte_nombre}} a absolver posiciones a tenor del pliego que oportunamente se acompañará, a la audiencia que a tal fin se designe, bajo apercibimiento de ley.

[PENDIENTE: si la contraparte es persona jurídica, consignar que deberá absolver posiciones por intermedio de su representante legal o apoderado con facultades suficientes, denunciando nombre y domicilio si se conocen].

4. TESTIMONIAL:

Ofrezco la declaración testimonial de las siguientes personas, y solicito que sean citadas por el Tribunal a comparecer a las audiencias que a tal fin se designen, bajo apercibimiento de ley:

A. [PENDIENTE: nombre y apellido, DNI, ocupación y domicilio del testigo 1].

B. [PENDIENTE: nombre y apellido, DNI, ocupación y domicilio del testigo 2].

C. [PENDIENTE: nombre y apellido, DNI, ocupación y domicilio del testigo 3, y agregar o suprimir testigos según el caso].

Los testigos declararán a tenor del interrogatorio que oportunamente se acompañará o que se formulará en la respectiva audiencia. Solicito se libren las cédulas de citación correspondientes, haciéndose saber a los testigos la carga pública de comparecer, bajo apercibimiento de ley.

[PENDIENTE: verificar el número máximo de testigos admitido según el fuero y el tipo de juicio, y ajustar la lista en consecuencia].

5. PERICIAL:

Solicito se designe perito único de oficio en la especialidad de [PENDIENTE: indicar especialidad: contable, médica, ingenieril, psicológica, caligráfica, etc.], quien, previa aceptación del cargo en legal forma, deberá expedirse sobre los siguientes puntos de pericia:

A. [PENDIENTE: punto de pericia 1].

B. [PENDIENTE: punto de pericia 2].

C. [PENDIENTE: punto de pericia 3 y agregar los que correspondan].

Hago expresa reserva de proponer perito de control de parte, a costa de esta parte, y de ampliar los puntos de pericia en la oportunidad procesal correspondiente.

III. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado en el carácter invocado y por cumplimentada en tiempo y forma la carga procesal de ofrecer prueba.

2. Tenga por ofrecida la prueba de la que intenta valerse esta parte y la provea favorablemente, ordenando su producción.

3. Designe las audiencias para la recepción de las pruebas confesional y testimonial, ordenando librar las citaciones correspondientes bajo apercibimiento de ley.

4. Ordene librar los oficios solicitados en concepto de prueba informativa, con autorización a esta parte para su diligenciamiento.

5. Designe perito en la especialidad indicada y, aceptado el cargo, fije plazo para la presentación del dictamen sobre los puntos de pericia propuestos.

Proveer de conformidad.
SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

update public.plantillas set nombre = 'Contestación de demanda', tipo = 'Contestación', categoria = 'contestacion', fuero = null, descripcion = 'Contestación de demanda civil multifuero con negativa general y particularizada (art. 192 CPCC Córdoba), desconocimiento de documental, realidad de los hechos y pedido de rechazo con costas', orden = 10, variables = ARRAY['abogado','matricula','cliente_nombre','cliente_documento','cliente_domicilio','expediente_caratula','nro_sac','juzgado','secretaria','estudio_domicilio','domicilio_electronico','fecha_notificacion_traslado','contraparte_nombre','monto_letras','monto']::text[], contenido = $tpl$CONTESTA DEMANDA. SOLICITA SU RECHAZO, CON COSTAS.

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante] de {{cliente_nombre}}, DNI N.º {{cliente_documento}}, con domicilio real en {{cliente_domicilio}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y respetuosamente digo:

[PENDIENTE: si se actúa como apoderado, acreditar personería acompañando el poder y agregar el párrafo de estilo; si el demandado comparece por derecho propio con patrocinio letrado, adecuar la comparecencia con sus datos personales completos: nacionalidad, edad, estado civil y profesión].

I. OBJETO.

Que vengo en tiempo y forma, dentro del plazo conferido por el proveído que ordenó correr traslado de la demanda, notificado a mi parte con fecha {{fecha_notificacion_traslado}}, a contestar la demanda promovida por {{contraparte_nombre}} en contra de mi [PENDIENTE: mandante/patrocinado], solicitando desde ya su rechazo total, con expresa imposición de costas a la parte actora, en mérito de las razones de hecho y de derecho que a continuación expongo.

II. NEGATIVA GENERAL.

Que, conforme lo impone el art. 192 del CPCC de Córdoba (ley 8465), vengo a negar todos y cada uno de los hechos afirmados en la demanda que no sean objeto de expreso y específico reconocimiento en el presente responde, como así también el derecho invocado por la actora y la procedencia de todos y cada uno de los rubros y montos reclamados.

Niego, asimismo, la autenticidad de toda la documental acompañada por la actora que no sea expresamente reconocida en este escrito, como así también la recepción de la correspondencia y demás comunicaciones que se atribuyen dirigidas a mi parte, en cuanto no sean expresamente reconocidas.

III. NEGATIVAS PARTICULARES.

Sin perjuicio de la negativa general que antecede, y a fin de dar acabado cumplimiento a la carga procesal impuesta por el art. 192 del CPCC, que exige negar categóricamente cada hecho afirmado en la demanda, niego en particular y en forma específica:

1. Niego que [PENDIENTE: primer hecho relevante afirmado en la demanda que se controvierte].

2. Niego que [PENDIENTE: segundo hecho relevante afirmado en la demanda que se controvierte].

3. Niego que [PENDIENTE: tercer hecho relevante afirmado en la demanda que se controvierte].

4. Niego que [PENDIENTE: agregar tantas negativas particulares como hechos relevantes contenga la demanda; la negativa debe ser específica, hecho por hecho, evitando fórmulas genéricas, bajo apercibimiento de que el silencio o las respuestas evasivas puedan ser tomadas como confesión].

5. Niego que mi parte adeude a la actora la suma de pesos {{monto_letras}} ($ {{monto}}) reclamada en la demanda, como así también que adeude suma alguna de dinero por ningún concepto, sea en concepto de capital, intereses o accesorios.

6. Niego la procedencia de los intereses pretendidos y de la tasa solicitada, como así también la procedencia de la imposición de costas a mi parte.

IV. DESCONOCIMIENTO DE LA DOCUMENTAL.

En cumplimiento de lo dispuesto por el art. 192 del CPCC, me expido en forma categórica sobre la documental acompañada con la demanda, a saber:

[PENDIENTE: individualizar cada documento acompañado por la actora indicando, respecto de cada uno, si se desconoce su autenticidad, su contenido, su firma y/o su recepción, o si se lo reconoce expresamente. Los instrumentos atribuidos a la parte demandada exigen pronunciamiento expreso].

V. REALIDAD DE LOS HECHOS.

La versión de los hechos expuesta en la demanda no se ajusta a la verdad de lo acontecido. La realidad de los hechos es la que a continuación se expone:

[PENDIENTE: relatar cronológicamente la versión de los hechos de la parte demandada, explicando las circunstancias de modo, tiempo y lugar, la relación que la vinculó —o no— con la actora y las razones por las cuales la pretensión resulta improcedente].

[PENDIENTE: si corresponde oponer excepciones (incompetencia, falta de legitimación, prescripción, pago, etc.) o deducir reconvención, desarrollarlas en secciones autónomas, verificando la oportunidad y la forma previstas por el CPCC para cada una].

VI. DERECHO.

Fundo el derecho de mi parte en lo dispuesto por el art. 192 y concordantes del CPCC de Córdoba (ley 8465), en las disposiciones pertinentes del Código Civil y Comercial de la Nación (ley 26.994) [PENDIENTE: precisar los artículos del CCCN y demás normas sustanciales aplicables a la defensa del caso concreto], y en la doctrina y jurisprudencia aplicables al caso.

VII. JURISPRUDENCIA.

[PENDIENTE: citar jurisprudencia aplicable sobre la carga de negativa específica del art. 192 del CPCC, la distribución de la carga de la prueba y la defensa de fondo planteada].

VIII. PRUEBA.

Para el caso de que el presente juicio tramite como abreviado, en el que la prueba debe ofrecerse junto con la contestación, o para la oportunidad procesal que corresponda según el tipo de procedimiento, ofrezco la siguiente:

1. DOCUMENTAL:

A. [PENDIENTE: individualizar cada documento que se acompaña con la contestación].

B. [PENDIENTE: agregar los incisos que sean necesarios].

C. Constancias de autos y documental acompañada por la propia actora, en cuanto favorezca a mi parte.

2. INFORMATIVA: Se libren oficios a:

A. [PENDIENTE: entidad u organismo, con indicación de los puntos sobre los que deberá informar].

3. CONFESIONAL: Se cite a la parte actora, {{contraparte_nombre}}, a absolver posiciones a tenor del pliego que oportunamente se acompañará, bajo apercibimiento de ley.

4. TESTIMONIAL: Se cite a prestar declaración testimonial a las siguientes personas:

A. [PENDIENTE: nombre completo, DNI y domicilio de cada testigo].

5. PERICIAL: [PENDIENTE: ofrecer la o las pericias pertinentes —caligráfica, contable, mecánica, médica, etc.—, con indicación de los puntos de pericia y solicitud de designación del perito por sorteo].

6. EXHIBICIÓN - RECONOCIMIENTO: [PENDIENTE: solicitar, si corresponde, la exhibición de documentación en poder de la actora o de terceros, y/o el reconocimiento de documentos o cosas].

IX. RESERVA DEL CASO FEDERAL.

Para el hipotético e improbable caso de que no se acogieran las defensas de mi parte, formulo expresa reserva de ocurrir ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario previsto por el art. 14 de la ley 48, por hallarse comprometidas garantías de raigambre constitucional, en especial los derechos de defensa en juicio, debido proceso y propiedad (arts. 17 y 18 de la Constitución Nacional).

X. SOLICITA REGULACIÓN DE HONORARIOS.

Solicito a V.S. regule mis honorarios profesionales correspondientes a la apertura de carpeta, conforme lo dispuesto por el art. 104 inc. 5 de la ley 9459.

XI. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, por parte en el carácter invocado y con el domicilio procesal y electrónico constituidos.

2. Tenga por contestada en tiempo y forma la demanda incoada en contra de mi [PENDIENTE: mandante/patrocinado], y por negados los hechos y el derecho invocados por la actora, en los términos del art. 192 del CPCC.

3. Tenga por desconocida e impugnada la documental acompañada por la parte actora, en los términos expuestos en el presente.

4. Tenga presente la prueba ofrecida para la oportunidad procesal que corresponda.

5. Tenga presente la reserva del caso federal formulada y provea la regulación de honorarios solicitada (art. 104 inc. 5, ley 9459).

6. Oportunamente al resolver, rechace la demanda en todas sus partes, con expresa imposición de costas a la parte actora.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$, updated_at = now() where id = 'c648f8cb-6843-4e07-8260-68873698fee1' and estudio_id is null;

update public.plantillas set nombre = 'Telegrama laboral (ley 23.789)', tipo = 'Telegrama', categoria = 'comunicacion', fuero = 'laboral', descripcion = 'Telegrama obrero gratuito de intimación al empleador, con variantes para aclaración de situación laboral, registración y pago de haberes en 48 horas', orden = 20, variables = ARRAY['cliente_nombre','cliente_documento','cliente_domicilio','localidad','contraparte_nombre','contraparte_documento','contraparte_domicilio','fecha','fecha_inicio_conflicto','fecha_ingreso_real','categoria_laboral','jornada_horario','monto_letras','monto','abogado','matricula']::text[], contenido = $tpl$TELEGRAMA LABORAL — LEY 23.789 (TELEGRAMA OBRERO GRATUITO)

NOTAS DE USO (eliminar este bloque antes de despachar):

1. El servicio telegráfico es gratuito para el trabajador dependiente (ley 23.789). Se despacha personalmente en cualquier sucursal del Correo Oficial, en el formulario de Telegrama Ley 23.789, exhibiendo DNI. Lo firma el propio trabajador, no el abogado.

2. Conservar la copia sellada del despacho y la constancia de entrega: constituyen prueba documental para el eventual juicio ante el fuero laboral de Córdoba (ley 7987).

3. Estilo telegráfico: texto breve, en mayúsculas, sin abreviaturas ambiguas. El formulario tiene espacio limitado; si el texto excede el formulario, evaluar carta documento ley 23.789.

4. El plazo de 48 horas se computa en horas hábiles. Nunca otorgar al empleador un plazo inferior a dos días hábiles para responder (art. 57 LCT).

5. [PENDIENTE: elegir supuesto — conservar UNA sola variante de texto (A, B, C o D), borrar las restantes y sus títulos identificatorios]

DATOS DEL REMITENTE (TRABAJADOR)

NOMBRE Y APELLIDO: {{cliente_nombre}}

DNI: {{cliente_documento}}

DOMICILIO: {{cliente_domicilio}}, {{localidad}}

DATOS DEL DESTINATARIO (EMPLEADOR)

NOMBRE O RAZÓN SOCIAL: {{contraparte_nombre}}

CUIT: {{contraparte_documento}}

DOMICILIO: {{contraparte_domicilio}}

FECHA DE DESPACHO: {{fecha}}

TEXTO A TRANSMITIR

VARIANTE A. ACLARACIÓN DE SITUACIÓN LABORAL (NEGATIVA DE TAREAS).

ANTE NEGATIVA DE TAREAS DESDE EL DIA {{fecha_inicio_conflicto}}, SIN CAUSA NI COMUNICACION ALGUNA DE SU PARTE, INTIMO PLAZO 48 HORAS HABILES ACLARE SITUACION LABORAL Y OTORGUE OCUPACION EFECTIVA EN MI CATEGORIA, JORNADA Y CONDICIONES HABITUALES DE TRABAJO (ART. 78 LCT), BAJO APERCIBIMIENTO DE CONSIDERARME GRAVEMENTE INJURIADO Y DESPEDIDO POR SU EXCLUSIVA CULPA (ARTS. 242 Y 246 LCT). SU SILENCIO IMPORTARA PRESUNCION EN SU CONTRA EN LOS TERMINOS DEL ART. 57 LCT. HAGO EXPRESA RESERVA DE ACCIONES LEGALES. QUEDA UD. DEBIDAMENTE NOTIFICADO.

VARIANTE B. REGISTRACIÓN DE LA RELACIÓN LABORAL.

TRABAJO BAJO SU DEPENDENCIA DESDE EL DIA {{fecha_ingreso_real}}, CATEGORIA {{categoria_laboral}} [PENDIENTE: indicar CCT aplicable si corresponde], JORNADA {{jornada_horario}}, CON REMUNERACION MENSUAL DE PESOS {{monto_letras}} ($ {{monto}}), ENCONTRANDOSE LA RELACION [PENDIENTE: elegir: TOTALMENTE SIN REGISTRAR / REGISTRADA CON FECHA DE INGRESO POSTERIOR A LA REAL / REGISTRADA CON REMUNERACION INFERIOR A LA REAL]. INTIMO PLAZO 30 DIAS CORRIDOS REGISTRE DEBIDAMENTE LA RELACION LABORAL CONFORME LOS DATOS VERIDICOS AQUI CONSIGNADOS [PENDIENTE: verificar norma — las intimaciones y multas de los arts. 8, 9, 10, 11 y 15 de la ley 24.013 fueron derogadas por la ley 27.742; adecuar cita, plazo y apercibimientos al régimen vigente y a la estrategia del caso], BAJO APERCIBIMIENTO DE CONSIDERARME GRAVEMENTE INJURIADO Y DESPEDIDO POR SU EXCLUSIVA CULPA (ARTS. 63, 242 Y 246 LCT). SU SILENCIO IMPORTARA PRESUNCION EN SU CONTRA EN LOS TERMINOS DEL ART. 57 LCT. HAGO EXPRESA RESERVA DE ACCIONES LEGALES. QUEDA UD. DEBIDAMENTE NOTIFICADO.

VARIANTE C. PAGO DE HABERES ADEUDADOS.

INTIMO PLAZO 48 HORAS HABILES ABONE HABERES ADEUDADOS CORRESPONDIENTES A [PENDIENTE: detallar períodos impagos, SAC, vacaciones no gozadas, horas extras], CUYOS PLAZOS LEGALES DE PAGO SE ENCUENTRAN VENCIDOS (ARTS. 74, 126, 128 Y 137 LCT), CON MAS INTERESES HASTA EL EFECTIVO PAGO, BAJO APERCIBIMIENTO DE CONSIDERARME GRAVEMENTE INJURIADO Y DESPEDIDO POR SU EXCLUSIVA CULPA (ARTS. 242 Y 246 LCT). HAGO EXPRESA RESERVA DE ACCIONES LEGALES. QUEDA UD. DEBIDAMENTE NOTIFICADO.

VARIANTE D. INTIMACIÓN INTEGRAL (COMBINACIÓN DE SUPUESTOS).

[PENDIENTE: combinar en un único texto los párrafos de las variantes A, B y C que correspondan al caso, manteniendo una sola fórmula de apercibimiento, una sola reserva de acciones y el cierre "QUEDA UD. DEBIDAMENTE NOTIFICADO."]

FIRMA DEL REMITENTE: {{cliente_nombre}}, DNI {{cliente_documento}}

ADVERTENCIA PROFESIONAL (eliminar este bloque antes de despachar): el texto debe ser revisado y adaptado por el abogado matriculado interviniente ({{abogado}}, M.P. {{matricula}}) antes del despacho. El contenido del telegrama fija la posición del trabajador en el eventual juicio: verificar la coherencia de fechas, categoría, jornada y remuneración con la futura demanda, y la suficiencia de la causal comunicada para el caso de despido indirecto (art. 243 LCT).$tpl$, updated_at = now() where id = '3b0dfe4c-aec9-4670-b89c-a9093484a6ac' and estudio_id is null;

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000007', null, 'global', 'Recurso de reposición con apelación en subsidio', 'Recurso', 'recurso', null, 'Impugna un decreto o providencia simple dictado sin sustanciación para que el mismo tribunal lo revoque por contrario imperio (art. 358 CPCC Córdoba), con apelación en subsidio para el caso de rechazo', 20, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','fecha_proveido','fecha_notificacion']::text[], $tpl$INTERPONE RECURSO DE REPOSICIÓN. APELACIÓN EN SUBSIDIO.

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante de la parte. ATENCIÓN: esta fórmula de comparecencia solo es correcta si el letrado actúa como APODERADO; si actúa como PATROCINANTE, reformular el proemio para que comparezca la parte por derecho propio, con el patrocinio letrado del firmante] de {{cliente_nombre}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, manteniendo el domicilio procesal y el domicilio electrónico constituidos en autos, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por la presente, en tiempo y forma, a interponer recurso de reposición en los términos del art. 358 del CPCC de Córdoba (ley 8465) en contra del proveído de fecha {{fecha_proveido}}, notificado a esta parte el día {{fecha_notificacion}}, solicitando a V.S. que lo revoque por contrario imperio y dicte en su lugar el que corresponde conforme a derecho, con costas. Para el supuesto de que la reposición no prospere, interpongo en este mismo acto recurso de apelación en subsidio, en los términos del art. 363 del CPCC, resultando la resolución atacada apelable conforme al art. 361 del mismo cuerpo legal, a fin de que la Excma. Cámara de Apelaciones que por turno corresponda revoque la resolución recurrida, todo ello en mérito de las razones de hecho y de derecho que seguidamente expongo.

II. LA RESOLUCIÓN RECURRIDA.

La resolución impugnada, consistente en un [PENDIENTE: decreto/auto] dictado con fecha {{fecha_proveido}}, dispone en su parte pertinente lo siguiente: [PENDIENTE: transcribir textualmente la parte pertinente del decreto o auto atacado].

Dicha resolución fue notificada a esta parte el día {{fecha_notificacion}} mediante [PENDIENTE: indicar la forma de notificación: e-cédula, notificación ministerio legis, retiro del expediente, etc.].

III. ADMISIBILIDAD Y TEMPESTIVIDAD.

A. Procedencia formal. El recurso de reposición procede contra los decretos y autos dictados sin sustanciación, a fin de que el mismo tribunal que los dictó los revoque por contrario imperio (art. 358 del CPCC). En el caso, la resolución atacada es un [PENDIENTE: decreto/auto] dictado sin previa sustanciación, por lo que la vía intentada resulta formalmente procedente. [PENDIENTE: verificar que la resolución atacada sea efectivamente un decreto o auto dictado SIN sustanciación; si fue dictada previa sustanciación, la reposición es improcedente y debe acudirse directamente a la apelación, si correspondiere].

B. Tempestividad. El presente recurso se interpone dentro del plazo de tres días contados desde la notificación de la resolución atacada (art. 359 del CPCC), por lo que resulta temporáneo.

C. Apelación subsidiaria. Sin perjuicio de lo anterior, y atento que la resolución recurrida no fue precedida de sustanciación, dejo interpuesto en este mismo acto recurso de apelación en subsidio (art. 363 del CPCC). La apelabilidad de la resolución atacada surge de [PENDIENTE: si lo recurrido es un AUTO, encuadrar la apelabilidad en el art. 361 inc. 2 del CPCC, sin necesidad de demostrar gravamen irreparable; si es una PROVIDENCIA SIMPLE (decreto), encuadrarla en el art. 361 inc. 3 y explicar brevemente en qué consiste el gravamen que la sentencia definitiva no podrá reparar].

IV. FUNDAMENTOS. AGRAVIOS.

La resolución atacada causa agravio a esta parte y debe ser revocada por las razones que a continuación se exponen:

1. [PENDIENTE: desarrollar el primer agravio: identificar el error de la resolución (de hecho, de derecho o de encuadre procesal), explicar por qué la decisión es incorrecta y cuál era la solución que correspondía adoptar].

2. [PENDIENTE: desarrollar agravios adicionales si los hubiera, o suprimir este punto].

En apoyo de la posición de esta parte, cabe señalar que la doctrina y la jurisprudencia son contestes en cuanto a que [PENDIENTE: citar jurisprudencia aplicable sobre la procedencia de la reposición y sobre la cuestión de fondo que motiva el agravio].

En virtud de lo expuesto, corresponde que V.S., previo traslado a la contraria por igual plazo si correspondiere (art. 359 del CPCC) —el traslado procede si la resolución fue dictada a petición de la parte contraria; si fue dictada de oficio, corresponde resolver sin sustanciación—, haga lugar al recurso, revoque por contrario imperio la resolución atacada y dicte en su lugar la siguiente: [PENDIENTE: indicar concretamente el proveído que se pretende obtener en reemplazo del recurrido].

V. APELACIÓN EN SUBSIDIO.

Para el supuesto, que sólo planteo por estricta hipótesis de máxima eventualidad procesal, de que V.S. decida mantener la resolución atacada, dejo interpuesto en este mismo acto recurso de apelación en subsidio (art. 363 del CPCC), a fin de que la Excma. Cámara de Apelaciones que por turno corresponda revoque la resolución recurrida y resuelva conforme a derecho.

Fundo la apelación subsidiaria en los mismos agravios desarrollados en el apartado IV del presente, los que doy por íntegramente reproducidos en honor a la brevedad, y en el encuadre de apelabilidad expuesto en el apartado III, punto C (arts. 361 y 363 del CPCC).

Solicito, en consecuencia, que para el caso de rechazo de la reposición se conceda la apelación interpuesta y se eleven las actuaciones al tribunal de alzada.

VI. DERECHO.

Fundo el presente recurso en lo dispuesto por los arts. 358, 359, 361 y 363 del CPCC de Córdoba (ley 8465), doctrina y jurisprudencia concordantes. [PENDIENTE: si el escrito se presenta en el fuero del trabajo u otro fuero con regulación recursiva propia, adecuar el encuadre normativo a la ley procesal específica (en el fuero laboral, ley 7987) y a la aplicación supletoria del CPCC].

VII. RESERVA DEL CASO FEDERAL.

Para el hipotético supuesto de que no se haga lugar a lo solicitado, dejo formulada expresa reserva del caso federal, para ocurrir oportunamente ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario previsto por el art. 14 de la ley 48, por encontrarse comprometidas las garantías constitucionales de defensa en juicio y debido proceso (art. 18 de la Constitución Nacional).

VIII. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, en el carácter invocado y acreditado en autos, manteniendo los domicilios procesal y electrónico constituidos.

2. Tenga por interpuesto en tiempo y forma recurso de reposición con apelación en subsidio en contra de la resolución de fecha {{fecha_proveido}}.

3. Imprima al recurso el trámite de ley y, si la resolución atacada hubiere sido dictada a petición de la parte contraria, corra traslado a ésta por el plazo de tres días (art. 359 del CPCC); en caso contrario, resuelva sin sustanciación.

4. Oportunamente, haga lugar a la reposición y revoque por contrario imperio la resolución atacada, dictando en su reemplazo la que corresponde conforme a derecho, con costas a la contraria en caso de oposición.

5. En subsidio, para el supuesto de que la reposición sea rechazada, conceda el recurso de apelación interpuesto (arts. 361 y 363 del CPCC) por ante la Excma. Cámara de Apelaciones que por turno corresponda.

6. Tenga presente la reserva del caso federal formulada.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000010', null, 'global', 'Solicita regulación de honorarios', 'Escrito', 'escrito', null, 'Escrito multifuero por el que el letrado solicita por derecho propio la regulación de sus honorarios conforme la ley 9459, denunciando base regulatoria, etapas cumplidas, apertura de carpeta e intereses hasta el efectivo pago', 40, ARRAY['abogado','matricula','estudio_domicilio','domicilio_electronico','expediente_caratula','nro_sac','juzgado','secretaria','cliente_nombre','cliente_documento','base_regulatoria_letras','base_regulatoria']::text[], $tpl$SOLICITA REGULACIÓN DE HONORARIOS PROFESIONALES

{{abogado}}, M.P. {{matricula}}, por derecho propio, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, en los autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, comparezco ante V.S. y respetuosamente digo:

I. OBJETO.

Que vengo por la presente a solicitar a V.S. proceda a regular los honorarios profesionales que me corresponden por las tareas desarrolladas en autos en mi carácter de [PENDIENTE: apoderado/patrocinante] de {{cliente_nombre}}, DNI N.º {{cliente_documento}}, de conformidad con las disposiciones del Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba, ley 9459, sobre la base regulatoria que se denuncia en el presente, con más los intereses que correspondan hasta la fecha de su efectivo pago, todo conforme a las consideraciones de hecho y de derecho que seguidamente expongo.

II. TAREAS PROFESIONALES CUMPLIDAS.

Que en los presentes autos he desempeñado la labor profesional que a continuación se detalla, la que resultó útil para la marcha del proceso y se encuentra íntegramente cumplida respecto de las etapas cuya regulación se peticiona, conforme surge de las constancias de la causa:

[PENDIENTE: detallar cronológicamente las etapas procesales cumplidas, con indicación de las presentaciones y diligencias comprendidas en cada una (p. ej.: primera etapa: demanda o contestación; segunda etapa: ofrecimiento y diligenciamiento de la prueba; alegatos; ejecución de sentencia; incidentes; recursos), con referencia a las operaciones obrantes en el SAC]

[PENDIENTE: indicar si la regulación se solicita por la totalidad de las tareas del juicio o por etapas cumplidas, y si existe resolución firme sobre imposición de costas, identificándola]

III. BASE REGULATORIA.

La base económica sobre la cual deberá practicarse la regulación asciende a la suma de pesos {{base_regulatoria_letras}} ($ {{base_regulatoria}}), la que se integra del siguiente modo: [PENDIENTE: detallar la composición de la base regulatoria según el tipo de proceso (monto de la sentencia, de la transacción, de la demanda o de la liquidación aprobada, con más los intereses calculados a la fecha), acompañando planilla de cálculo si corresponde] ([PENDIENTE: verificar norma y artículo de la ley 9459 aplicable a la determinación de la base regulatoria según el tipo de proceso]).

IV. PAUTAS DE EVALUACIÓN Y ESCALA APLICABLE.

A los fines de la regulación que se solicita, pido a V.S. tenga presentes las pautas cualitativas de evaluación previstas por el art. 39 de la ley 9459, en especial el valor y la eficacia de la defensa, la complejidad de las cuestiones planteadas y el resultado obtenido, así como la escala del art. 36 del mismo cuerpo legal, aplicada sobre la base regulatoria denunciada y conforme la división por etapas que la ley 9459 prevé para el tipo de proceso de que se trata ([PENDIENTE: verificar norma y artículo de la ley 9459 sobre división en etapas según la clase de juicio]).

[PENDIENTE: desarrollar, si conviene a la petición, las circunstancias concretas que justifican apartarse del mínimo de la escala: novedad de la cuestión, extensión del trámite, cuantía del asunto, trascendencia para el cliente]

V. APERTURA DE CARPETA.

Solicito asimismo se regulen a mi favor los honorarios previstos por el art. 104 inc. 5 de la ley 9459, equivalentes a tres (3) jus, correspondientes a las tareas de apertura de carpeta. [PENDIENTE: suprimir esta sección si los honorarios del art. 104 inc. 5 ya fueron peticionados o regulados con anterioridad en la causa, o si no corresponde su procedencia]

VI. INTERESES.

Atento el carácter alimentario que reviste el honorario profesional, solicito que las sumas que se regulen devenguen intereses desde [PENDIENTE: indicar el dies a quo que corresponda: fecha de la regulación o constitución en mora del obligado al pago] y hasta la fecha de su efectivo pago, conforme la tasa de uso judicial. [PENDIENTE: citar jurisprudencia aplicable sobre la tasa de interés de uso judicial en la Provincia de Córdoba]

VII. DERECHO.

Fundo la presente petición en lo dispuesto por la ley 9459 (arts. 36, 39, 104 inc. 5 y concordantes) y en las normas procesales que rigen el trámite según el fuero de radicación de la causa ([PENDIENTE: verificar norma procesal aplicable: CPCC ley 8465 o Ley Procesal del Trabajo ley 7987, según corresponda]).

VIII. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado por derecho propio, con el domicilio procesal y el domicilio electrónico constituidos.

2. Imprima a la presente el trámite de ley y, de corresponder, corra vista o noticia a [PENDIENTE: indicar la parte obligada al pago de las costas].

3. Tenga por denunciada la base regulatoria y por detalladas las tareas profesionales cumplidas en autos.

4. Oportunamente, regule los honorarios profesionales del suscripto por la labor desarrollada en la causa, conforme la base denunciada y las pautas de los arts. 36, 39 y concordantes de la ley 9459.

5. Regule asimismo los honorarios previstos por el art. 104 inc. 5 de la ley 9459, en caso de así corresponder.

6. Disponga que los honorarios que se regulen devenguen intereses desde [PENDIENTE: dies a quo] y hasta la fecha de su efectivo e íntegro pago.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000009', null, 'global', 'Solicita embargo preventivo', 'Escrito', 'escrito', null, 'Solicitud de medida cautelar de embargo preventivo inaudita parte, con verosimilitud del derecho, peligro en la demora, contracautela y libramiento de oficios, apta para cualquier fuero', 30, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','estudio_domicilio','domicilio_electronico','contraparte_nombre','contraparte_documento','contraparte_domicilio','monto_letras','monto','monto_presupuestado_letras','monto_presupuestado']::text[], $tpl$SOLICITA EMBARGO PREVENTIVO. OFRECE CONTRACAUTELA.

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante; si se actúa como apoderado, indicar cómo se acredita la personería: poder que se acompaña en este acto o poder ya agregado en autos, art. 90 del CPCC de Córdoba] de {{cliente_nombre}}, en autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, constituyendo domicilio procesal en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo por el presente a solicitar a V.S. que, sin sustanciación previa con la contraria, decrete EMBARGO PREVENTIVO sobre bienes de {{contraparte_nombre}}, DNI/CUIT N° {{contraparte_documento}}, con domicilio en {{contraparte_domicilio}}, hasta cubrir la suma de pesos {{monto_letras}} ($ {{monto}}), con más la suma de pesos {{monto_presupuestado_letras}} ($ {{monto_presupuestado}}) que se presupuesta provisoriamente para responder a intereses y costas, o la que V.S. estime corresponder, conforme a las razones de hecho y de derecho que seguidamente expongo.

La medida que se solicita reviste naturaleza cautelar y, como tal, debe decretarse y trabarse INAUDITA PARTE, pues su anoticiamiento previo a la afectada frustraría la finalidad asegurativa que la justifica.

[PENDIENTE: si la cautelar se solicita antes de promover la demanda, dejar constancia de que la demanda será interpuesta dentro del plazo legal, bajo apercibimiento de caducidad de la medida — verificar norma y plazo en el CPCC de Córdoba].

II. VEROSIMILITUD DEL DERECHO. DOCUMENTAL QUE SE ACOMPAÑA.

Es doctrina recibida que para el despacho de las medidas cautelares no se exige una prueba acabada ni la certeza del derecho invocado, sino su mera apariencia o probabilidad, juicio provisional que no causa estado y que se satisface con los elementos que se acompañan y con las constancias de autos.

En el caso, la verosimilitud del derecho invocado por mi parte surge de: [PENDIENTE: exponer los elementos que tornan verosímil el derecho: título de la obligación (contrato, pagaré, factura, reconocimiento de deuda, sentencia), documental acompañada, estado de la causa, admisiones de la contraria, etc.].

A fin de acreditar prima facie los extremos invocados, acompaño con el presente la siguiente documental: [PENDIENTE: detallar la documental que se acompaña, individualizándola por incisos A., B., C.].

[PENDIENTE: citar jurisprudencia aplicable sobre la verosimilitud del derecho como recaudo del embargo preventivo].

III. PELIGRO EN LA DEMORA.

El tiempo que necesariamente insumirá la tramitación del proceso hasta el dictado de una sentencia firme coloca el crédito de mi parte en riesgo cierto de tornarse de imposible o muy dificultosa percepción, si no se asegura desde ahora la responsabilidad patrimonial de la contraria.

En el caso concreto, el peligro en la demora se configura por las siguientes circunstancias objetivas: [PENDIENTE: describir los hechos que evidencian el riesgo: estado patrimonial de la contraria, actos de disposición o intentos de enajenación de bienes, cesación de pagos, embargos o inhibiciones anteriores, cierre del establecimiento, conducta evasiva, etc.].

[PENDIENTE: citar jurisprudencia aplicable sobre el peligro en la demora como recaudo de las medidas cautelares].

IV. BIENES SOBRE LOS QUE SE SOLICITA LA TRABA. MONTO.

Solicito que el embargo preventivo se trabe, hasta cubrir el monto indicado en el objeto del presente, sobre los siguientes bienes de la cautelada:

[PENDIENTE: individualizar los bienes a embargar y el organismo al que deberá oficiarse en cada caso. Por ejemplo: A. Inmueble inscripto en el Registro General de la Provincia (matrícula, designación, ubicación). B. Automotor (dominio, marca, modelo), con oficio al Registro Nacional de la Propiedad del Automotor. C. Fondos depositados en cuentas bancarias (entidad, sucursal, CBU si se conoce), con comunicación por medio del Banco Central de la República Argentina. D. Créditos o sumas que la cautelada tenga a percibir de terceros (individualizar al tercero y su domicilio). E. Bienes muebles, con intervención del oficial de justicia.].

A tal fin, solicito se libren los oficios y/o comunicaciones electrónicas que correspondan a los registros, entidades y organismos pertinentes para la efectiva anotación y traba de la medida [PENDIENTE: indicar personas autorizadas para el diligenciamiento, si corresponde].

V. CONTRACAUTELA.

A fin de responder por los eventuales daños y perjuicios que la medida pudiere ocasionar para el supuesto de haber sido solicitada sin derecho, ofrezco la siguiente contracautela: [PENDIENTE: indicar la contracautela ofrecida: fianza personal del letrado interviniente, caución juratoria, caución real (individualizar bienes) o seguro de caución; o, en su caso, fundar la eximición o atenuación de contracautela (p. ej., trabajador amparado por el beneficio de gratuidad del art. 20 de la LCT, beneficio de litigar sin gastos, verosimilitud calificada del derecho)].

Pido a V.S. que la tenga por ofrecida y, en su caso, la califique y gradúe conforme a las circunstancias de la causa.

VI. TRÁMITE INAUDITA PARTE.

Conforme a la naturaleza propia de las medidas cautelares, éstas se decretan y cumplen sin audiencia previa de la parte afectada, quien podrá ejercer plenamente su derecho de defensa con posterioridad a la traba, por las vías impugnativas que la ley le acuerda. Solicito, en consecuencia, que el presente pedido se provea sin sustanciación alguna y que la notificación a la cautelada se practique una vez efectivizada la medida [PENDIENTE: verificar la norma del CPCC de Córdoba sobre el despacho sin audiencia de la contraria y la notificación posterior a la traba].

VII. DERECHO.

Fundo el derecho que asiste a mi parte en lo dispuesto por los arts. 456 y siguientes del Código Procesal Civil y Comercial de la Provincia de Córdoba (ley 8465) [PENDIENTE: verificar los artículos del CPCC aplicables al embargo preventivo y a la contracautela y, si el proceso tramita en otro fuero, la norma procesal propia —p. ej., ley 7987 en el fuero del trabajo— y su remisión supletoria al CPCC], y en la doctrina y jurisprudencia concordantes.

VIII. RESERVA DEL CASO FEDERAL.

Para el hipotético supuesto de que no se hiciera lugar a lo solicitado, y por hallarse comprometidas garantías de raigambre constitucional (derecho de propiedad, debido proceso y defensa en juicio, arts. 17 y 18 de la Constitución Nacional), formulo expresa reserva del caso federal para ocurrir, oportunamente, ante la Corte Suprema de Justicia de la Nación por la vía del recurso extraordinario.

[PENDIENTE: evaluar la utilidad de mantener esta reserva en el caso concreto: la denegatoria de una medida cautelar no constituye, en principio, sentencia definitiva a los fines del recurso extraordinario federal, salvo que ocasione un agravio de imposible o insuficiente reparación ulterior].

IX. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Me tenga por presentado, en el carácter invocado, con el domicilio procesal y electrónico constituidos, y por formuladas las manifestaciones que anteceden.

2. Tenga por acompañada la prueba documental individualizada en el punto II.

3. Decrete EMBARGO PREVENTIVO INAUDITA PARTE sobre bienes de {{contraparte_nombre}}, hasta cubrir la suma de pesos {{monto_letras}} ($ {{monto}}), con más lo presupuestado provisoriamente para responder a intereses y costas.

4. Tenga por ofrecida la contracautela indicada en el punto V y, previo su cumplimiento si así se lo estimare, la califique y gradúe conforme a las circunstancias de la causa.

5. Ordene trabar el embargo sobre los bienes individualizados en el punto IV y, a tal fin, libre los oficios y/o comunicaciones que correspondan a los registros, entidades y organismos pertinentes, con las facultades necesarias para su diligenciamiento.

[6. Si la medida se solicita antes de promover la demanda: Tenga presente que la demanda será promovida dentro del plazo legal, bajo apercibimiento de caducidad de la medida.]

7. Tenga presente la reserva del caso federal formulada.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

update public.plantillas set nombre = 'Carta poder — apoderamiento judicial', tipo = 'Carta poder', categoria = 'escrito', fuero = null, descripcion = 'Poder especial que el cliente firma a favor del letrado para actuar en un juicio determinado, con las facultades de estilo, cláusula de facultades de disposición a definir y espacio para certificación de firma', orden = 50, variables = ARRAY['localidad','fecha','cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','expediente_caratula','nro_sac','juzgado','secretaria','fuero','contraparte_nombre','contraparte_domicilio']::text[], contenido = $tpl$CARTA PODER — PODER ESPECIAL PARA ACTUAR EN JUICIO

En la ciudad de {{localidad}}, Provincia de Córdoba, República Argentina, en la fecha {{fecha}}, quien suscribe, {{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, edad, estado civil y, en su caso, CUIL/CUIT], con domicilio real en {{cliente_domicilio}}, en adelante la parte PODERDANTE, otorga PODER ESPECIAL, amplio y suficiente, a favor de {{abogado}}, M.P. {{matricula}}, con domicilio profesional en {{estudio_domicilio}} y domicilio electrónico {{domicilio_electronico}}, en adelante la parte APODERADA, [PENDIENTE: si se apodera a más de un letrado, consignar nombre y matrícula de cada uno y aclarar si actuarán en forma conjunta, separada o indistinta], conforme a las cláusulas que siguen:

I. OBJETO DEL PODER.

El presente poder se otorga para que la parte apoderada intervenga, en nombre y representación de la parte poderdante, en los autos caratulados “{{expediente_caratula}}” (Expte. N.º {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, fuero {{fuero}} [PENDIENTE: si el juicio aún no se inició, suprimir la referencia al expediente e identificar con precisión la acción a promover en contra de {{contraparte_nombre}}, con domicilio en {{contraparte_domicilio}}], así como en sus medidas preparatorias y cautelares, incidentes, tercerías, recursos, ejecución de sentencia y toda otra tramitación judicial o administrativa conexa, ante los tribunales de cualquier fuero e instancia de la Provincia de Córdoba, la Justicia Federal y los organismos administrativos que correspondan.

II. FACULTADES CONFERIDAS.

En ejercicio del presente mandato, la parte apoderada queda facultada para:

A. Iniciar, promover, ampliar, modificar y contestar demandas y reconvenciones.

B. Oponer y contestar excepciones e incidentes de toda clase.

C. Prorrogar y declinar jurisdicción y competencia; recusar con y sin expresión de causa; plantear nulidades.

D. Ofrecer, producir y controlar toda clase de prueba; proponer testigos y peritos; solicitar la absolución de posiciones de la contraria; reconocer y desconocer firmas y documentos; solicitar exhibiciones y reconocimientos.

E. Asistir a toda clase de audiencias, incluidas las de conciliación y la de vista de la causa, con las limitaciones previstas en la cláusula III.

F. Interponer, sostener y desistir recursos ordinarios y extraordinarios, incluidos los de reposición, apelación, casación e inconstitucionalidad locales y el recurso extraordinario federal, así como las quejas por su denegación.

G. Solicitar toda clase de medidas cautelares, embargos, inhibiciones, anotaciones de litis y prohibiciones de innovar, sus ampliaciones, sustituciones y levantamientos.

H. Percibir las sumas que correspondan a la parte poderdante en concepto de capital, intereses y costas, otorgando recibos y cartas de pago suficientes, y solicitar órdenes de pago y transferencias de fondos depositados judicialmente.

I. Notificarse de toda clase de resoluciones; diligenciar oficios, exhortos, cédulas y mandamientos; retirar expedientes, documentación, testimonios y copias; efectuar presentaciones electrónicas ante el SAC en nombre de la parte poderdante.

J. Sustituir total o parcialmente el presente poder y revocar las sustituciones que efectúe, reasumiendo su ejercicio cuando lo estime conveniente.

K. Realizar, en general, cuantos más actos, gestiones y diligencias resulten necesarios o convenientes para el mejor desempeño del mandato, siendo la presente enumeración meramente enunciativa y no taxativa, sin perjuicio de lo dispuesto en la cláusula III.

III. FACULTADES QUE REQUIEREN AUTORIZACIÓN EXPRESA.

Conforme al art. 375 del Código Civil y Comercial de la Nación (ley 26.994), los actos de disposición requieren facultades expresas. [PENDIENTE: consignar expresamente, solo si la parte poderdante así lo decide y con los límites que fije, las facultades de transar, conciliar, comprometer en árbitros, allanarse, desistir del derecho, renunciar a derechos litigiosos y remitir deudas; si no se autorizan, dejar constancia de que tales actos quedan reservados en forma exclusiva a la parte poderdante].

IV. MARCO NORMATIVO.

El presente poder se otorga en los términos de los arts. 358 y siguientes y 1319 y siguientes del Código Civil y Comercial de la Nación (ley 26.994) y de la normativa procesal aplicable según el fuero: en el fuero del trabajo, la Ley Procesal del Trabajo de la Provincia de Córdoba, ley 7987 [PENDIENTE: verificar norma y artículo de la ley 7987 sobre representación mediante carta poder y autoridades habilitadas para certificar la firma]; en los restantes fueros provinciales, el Código Procesal Civil y Comercial de la Provincia de Córdoba, ley 8465 [PENDIENTE: verificar norma y artículo sobre justificación de la personería y confirmar si el tribunal interviniente exige poder otorgado por escritura pública o acta labrada ante el tribunal, en lugar de carta poder].

V. VIGENCIA, HONORARIOS Y RATIFICACIÓN.

El presente poder conservará su vigencia hasta la conclusión definitiva de las actuaciones para las que se otorga, incluida la etapa de ejecución de sentencia, mientras no sea revocado en forma expresa y fehaciente. La parte poderdante se obliga a tener por válido y firme todo cuanto la parte apoderada realice en ejercicio del presente mandato. Los honorarios profesionales se regirán por el Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba, ley 9459 [PENDIENTE: indicar si existe convenio de honorarios o pacto de cuota litis y, en su caso, agregarlo como anexo].

En prueba de conformidad, previa lectura y ratificación de su contenido, la parte poderdante firma un (1) ejemplar de la presente en el lugar y la fecha indicados en el encabezamiento.

FIRMA DEL PODERDANTE: ........................................................

ACLARACIÓN: {{cliente_nombre}}

DNI N.º: {{cliente_documento}}

CERTIFICACIÓN DE FIRMA.

Certifico que la firma que antecede fue puesta en mi presencia por {{cliente_nombre}}, DNI N.º {{cliente_documento}}, quien acreditó su identidad con el documento citado, en {{localidad}}, en la fecha {{fecha}}. [PENDIENTE: completar por la autoridad certificante —escribano público, secretario o prosecretario del tribunal, juez de paz u otra autoridad habilitada según el fuero— con su firma, sello, cargo y, en su caso, número de acta o foja del libro de certificaciones].$tpl$, updated_at = now() where id = 'e0f4d5f2-c1b3-4d21-92c7-11663528b16a' and estudio_id is null;

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000011', null, 'global', 'Convenio de honorarios', 'Convenio', 'convenio', null, 'Convenio de honorarios profesionales entre abogado y cliente conforme ley 9459, con opción de suma fija o pacto de cuota litis, para asuntos judiciales o extrajudiciales de cualquier fuero', 10, ARRAY['localidad','fecha','cliente_nombre','cliente_documento','cliente_domicilio','abogado','matricula','estudio_domicilio','domicilio_electronico','expediente_caratula','nro_sac','juzgado','secretaria','monto_letras','monto','porcentaje_cuota_litis','anticipo_letras','anticipo_monto','cantidad_cuotas','valor_cuota_letras','valor_cuota','fecha_primera_cuota']::text[], $tpl$CONVENIO DE HONORARIOS PROFESIONALES

En la ciudad de {{localidad}}, Provincia de Córdoba, en la fecha {{fecha}}, entre {{cliente_nombre}}, DNI N.º {{cliente_documento}}, [PENDIENTE: nacionalidad, estado civil y demás datos personales del cliente; si se trata de persona jurídica, consignar denominación, CUIT, datos de inscripción y del representante que suscribe], con domicilio real en {{cliente_domicilio}}, en adelante denominado "EL CLIENTE", por una parte; y por la otra {{abogado}}, M.P. {{matricula}}, con domicilio profesional en {{estudio_domicilio}} y domicilio electrónico en {{domicilio_electronico}}, en adelante denominado "EL PROFESIONAL", se celebra el presente CONVENIO DE HONORARIOS PROFESIONALES, en los términos del art. 1255 del Código Civil y Comercial de la Nación (ley 26.994) y de la ley provincial 9459 (Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba), el que se regirá por las cláusulas siguientes:

PRIMERA: OBJETO DEL ENCARGO. EL CLIENTE encomienda a EL PROFESIONAL, y este acepta, el patrocinio letrado y/o la representación de sus intereses en el siguiente asunto: [PENDIENTE: describir con precisión el encargo profesional: tipo de proceso o gestión (judicial o extrajudicial), fuero, pretensión y alcance del encargo]. [PENDIENTE: si el asunto ya se encuentra judicializado, individualizarlo así: autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}; en caso contrario, suprimir esta mención]. El encargo comprende [PENDIENTE: precisar etapas incluidas: gestiones extrajudiciales previas, primera instancia, recursos ordinarios y extraordinarios, ejecución de sentencia; lo no incluido será objeto de convenio separado].

SEGUNDA: HONORARIOS. Por la totalidad de la labor profesional descripta en la cláusula PRIMERA, las partes convienen los honorarios conforme a una de las siguientes modalidades [PENDIENTE: elegir la Opción A o la Opción B y suprimir la restante]:

OPCIÓN A — HONORARIO CONVENIDO EN SUMA FIJA: EL CLIENTE abonará a EL PROFESIONAL, en concepto de honorarios, la suma de pesos {{monto_letras}} ($ {{monto}}).

OPCIÓN B — PACTO DE CUOTA LITIS: EL CLIENTE abonará a EL PROFESIONAL, en concepto de honorarios, el {{porcentaje_cuota_litis}} por ciento ({{porcentaje_cuota_litis}} %) de todas las sumas que efectivamente perciba, por capital e intereses, como consecuencia del asunto encomendado, sea por sentencia, transacción, conciliación, allanamiento, pago espontáneo o cualquier otro modo de terminación del pleito o de la gestión. Las partes dejan constancia de que el porcentaje pactado no supera el tope legal de [PENDIENTE: verificar tope legal ley 9459]. [PENDIENTE: si el asunto es de naturaleza laboral, verificar además los topes y recaudos propios del pacto de cuota litis en esa materia (art. 277 LCT, ley 20.744), incluida la eventual necesidad de ratificación personal del trabajador y homologación judicial].

Los honorarios aquí convenidos son independientes de los que se regulen judicialmente a cargo de la parte contraria en concepto de costas. Para el supuesto de que EL PROFESIONAL percibiera efectivamente honorarios de la condenada en costas, [PENDIENTE: definir si dichas sumas se imputan a cuenta del honorario convenido o se acumulan a este]. Los importes convenidos no incluyen el Impuesto al Valor Agregado, el que se adicionará en caso de corresponder conforme a la condición tributaria de EL PROFESIONAL. Si el presente convenio fuera declarado nulo, ineficaz o inoponible en sede judicial, los honorarios de EL PROFESIONAL se determinarán conforme a las pautas regulatorias de la ley 9459.

TERCERA: FORMA DE PAGO. Los honorarios convenidos se abonarán de la siguiente manera [PENDIENTE: elegir la modalidad de pago y suprimir la restante]: A. De contado, en este acto, sirviendo el presente de suficiente recibo y carta de pago por la suma entregada. B. Mediante un anticipo de pesos {{anticipo_letras}} ($ {{anticipo_monto}}), que se abona en este acto, y el saldo en {{cantidad_cuotas}} cuotas mensuales, iguales y consecutivas de pesos {{valor_cuota_letras}} ($ {{valor_cuota}}) cada una, con vencimiento la primera el día {{fecha_primera_cuota}} y las restantes el mismo día de los meses subsiguientes. Los pagos se efectuarán en el domicilio profesional indicado en el encabezamiento o mediante transferencia bancaria a la cuenta que EL PROFESIONAL denuncie, sirviendo el recibo extendido o la constancia de transferencia como suficiente prueba del pago.

CUARTA: GASTOS Y APORTES. Todos los gastos que demande la tramitación del asunto, tales como tasa de justicia, aportes previsionales y colegiales de ley, sellados, edictos, honorarios y gastos de peritos, gastos de diligenciamiento, certificaciones, informes y correspondencia, serán a exclusivo cargo de EL CLIENTE y no se encuentran incluidos en los honorarios convenidos en la cláusula SEGUNDA. EL PROFESIONAL podrá requerir a EL CLIENTE una provisión de fondos previa a la realización de las gestiones que los originen. Las sumas que EL PROFESIONAL adelantare por tales conceptos le serán reembolsadas dentro de los [PENDIENTE: cantidad de días] días de notificado EL CLIENTE en forma fehaciente, con más los intereses previstos en la cláusula QUINTA en caso de mora.

QUINTA: MORA E INTERESES. La mora en el cumplimiento de las obligaciones de pago asumidas en este convenio se producirá de pleno derecho, por el solo vencimiento de los plazos pactados y sin necesidad de interpelación previa alguna (art. 886 del Código Civil y Comercial de la Nación). Producida la mora, las sumas adeudadas devengarán un interés moratorio equivalente a [PENDIENTE: definir la tasa de interés moratorio aplicable; es de uso forense en Córdoba la tasa pasiva promedio que publica el B.C.R.A. con más un componente nominal mensual]. La falta de pago en término de [PENDIENTE: cantidad de cuotas] cuotas, consecutivas o alternadas, producirá la caducidad de los plazos acordados y tornará exigible la totalidad del saldo adeudado, como si fuera de plazo vencido.

SEXTA: REVOCACIÓN, DESISTIMIENTO Y TRANSACCIÓN. Si EL CLIENTE revocara el patrocinio o el mandato sin causa imputable a EL PROFESIONAL, desistiera del asunto encomendado, o transara, conciliara o percibiera su crédito sin intervención de aquel, los honorarios convenidos en la cláusula SEGUNDA serán íntegramente exigibles. En la modalidad de pacto de cuota litis, el porcentaje convenido se calculará sobre el monto de la transacción, conciliación o percepción y, en su defecto, sobre el valor de la pretensión [PENDIENTE: ajustar esta previsión a la modalidad de honorarios efectivamente elegida en la cláusula SEGUNDA]. Si la revocación obedeciera a causa imputable a EL PROFESIONAL, los honorarios se determinarán en proporción a la labor efectivamente cumplida, conforme a las pautas de la ley 9459.

SÉPTIMA: DOMICILIOS Y NOTIFICACIONES. Las partes constituyen domicilios especiales en los indicados en el encabezamiento del presente, donde se tendrán por válidas y eficaces todas las notificaciones, intimaciones y emplazamientos, judiciales o extrajudiciales, que se cursen con motivo de este convenio, los que subsistirán mientras no se notifique en forma fehaciente su modificación.

OCTAVA: JURISDICCIÓN Y LEY APLICABLE. Para todos los efectos derivados del presente convenio, las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad de {{localidad}}, Provincia de Córdoba, con renuncia expresa a cualquier otro fuero o jurisdicción que pudiera corresponderles. El presente se rige por el Código Civil y Comercial de la Nación (ley 26.994) y por la ley provincial 9459.

NOVENA: EJEMPLARES. En prueba de conformidad, previa lectura y ratificación de su contenido, las partes firman dos (2) ejemplares de un mismo tenor y a un solo efecto, recibiendo cada una el suyo en este acto, en la ciudad de {{localidad}}, en la fecha indicada en el encabezamiento.

........................................................
{{cliente_nombre}}
DNI N.º {{cliente_documento}}
EL CLIENTE

........................................................
{{abogado}}
M.P. {{matricula}}
EL PROFESIONAL$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

insert into public.plantillas (id, estudio_id, ambito, nombre, tipo, categoria, fuero, descripcion, orden, variables, contenido)
values ('5eed0000-0000-4000-8000-000000000012', null, 'global', 'Alegato de bien probado', 'Escrito', 'escrito', null, 'Alegato sobre el mérito de la prueba en el juicio ordinario civil (art. 505 CPCC Córdoba), con análisis por medio probatorio y conclusiones', 60, ARRAY['abogado','matricula','cliente_nombre','expediente_caratula','nro_sac','juzgado','secretaria','domicilio_electronico','contraparte_nombre']::text[], $tpl$[PENDIENTE: NOTA DE USO — verificar procedencia y eliminar esta nota antes de presentar. El alegato escrito del art. 505 del CPCC (ley 8465) rige el juicio declarativo ordinario; en el juicio abreviado no existe etapa de alegatos escritos, y en el fuero laboral (ley 7987) el alegato es oral, en la audiencia de vista de causa. Se aclara además que el art. 327 del CPCC emplea la expresión "sana crítica"; la fórmula "sana crítica racional" utilizada en este escrito es la de uso corriente en el foro cordobés.]

ALEGA SOBRE EL MÉRITO DE LA PRUEBA. ALEGATO DE BIEN PROBADO.

{{abogado}}, M.P. {{matricula}}, en mi carácter de [PENDIENTE: apoderado/patrocinante — ADVERTENCIA: la redacción en primera persona del letrado ("comparezco ante V.S. y digo") solo es correcta si actúa como apoderado; si actúa como patrocinante, el escrito debe encabezarlo la parte por derecho propio con patrocinio letrado, lo que exige reescribir esta comparecencia y prever la firma de la parte] de {{cliente_nombre}}, parte [PENDIENTE: actora/demandada] en los autos caratulados “{{expediente_caratula}}” (Expte. N° {{nro_sac}}), que tramitan ante {{juzgado}}, {{secretaria}}, manteniendo el domicilio procesal constituido en autos y el domicilio electrónico {{domicilio_electronico}}, comparezco ante V.S. y digo:

I. OBJETO.

Que vengo en tiempo y forma, dentro del plazo del traslado corrido mediante proveído de fecha [PENDIENTE: fecha del decreto que ordena correr traslados para alegar] y de conformidad con lo dispuesto por el art. 505 del CPCC (ley 8465), a alegar sobre el mérito de la prueba rendida en autos, a fin de demostrar que los extremos fácticos invocados por mi parte han quedado debida y acabadamente acreditados, y que, en consecuencia, corresponde que V.S., al momento de dictar sentencia, [PENDIENTE: haga lugar a la demanda en todas sus partes / rechace íntegramente la demanda], con expresa imposición de costas a la contraria, todo conforme a las consideraciones que seguidamente expongo.

II. LA PRUEBA RENDIDA.

Liminarmente, y a fin de ordenar la exposición, cabe recordar los términos en que quedó trabada la litis: [PENDIENTE: sintetizar la pretensión deducida, los hechos afirmados por cada parte, las defensas opuestas y los hechos controvertidos que constituyeron el objeto de la prueba].

Sobre tales hechos controvertidos versó la actividad probatoria desplegada en autos, cuyo mérito corresponde ahora analizar conforme a las reglas de la sana crítica racional (art. 327 del CPCC), examinando cada medio probatorio en particular y, luego, su valoración conjunta y armónica. [PENDIENTE: suprimir los acápites correspondientes a medios de prueba no producidos en autos].

1. DOCUMENTAL:

La prueba documental ofrecida por mi parte fue oportunamente acompañada e incorporada al proceso. [PENDIENTE: indicar si fue reconocida expresamente por la contraria, si no fue objeto de desconocimiento, impugnación ni redargución de falsedad, o de qué modo quedó autenticada; y, conforme al resultado de esa verificación, concluir sobre su valor: solo si quedó incólume corresponde afirmar que goza de plena eficacia probatoria y debe ser merituada en toda su extensión; si fue cuestionada, refutar aquí la impugnación].

[PENDIENTE: merituar cada documento relevante en acápites A., B., C., identificándolo con precisión, indicando qué hecho controvertido acredita y cómo se vincula con los restantes medios de prueba].

2. INFORMATIVA:

[PENDIENTE: describir el estado del diligenciamiento de los oficios librados (entidades requeridas y contestaciones recibidas) e indicar si las respuestas fueron o no impugnadas por la contraria; solo si no medió impugnación corresponde afirmar que sus constancias revisten plena fuerza convictiva; si la hubo, refutarla aquí].

[PENDIENTE: merituar cada informe (entidad oficiada, fecha de contestación, contenido relevante y hecho controvertido que acredita)].

3. CONFESIONAL:

[PENDIENTE: merituar la absolución de posiciones: identificar al absolvente, señalar las posiciones cuya respuesta favorece a esta parte, la existencia de confesión expresa o ficta y su alcance probatorio, destacando las contradicciones del absolvente con su propia postura procesal].

4. TESTIMONIAL:

[PENDIENTE: indicar si las declaraciones testimoniales rendidas resultan contestes y concordantes y si los deponentes dan suficiente razón de sus dichos; verificar si hubo tachas u observaciones de la contraria: solo si no las hubo corresponde afirmar que los testigos no fueron tachados ni sus declaraciones impugnadas y que merecen plena fe conforme a las reglas de la sana crítica racional; si las hubo, refutarlas en este acápite].

[PENDIENTE: merituar cada testimonio en acápites A., B., C.: identificar al testigo, transcribir o sintetizar las respuestas relevantes con indicación de la pregunta respondida, explicar la razón de sus dichos, su concordancia con la restante prueba y qué hecho controvertido acredita; en su caso, refutar las tachas u observaciones formuladas respecto de cada deponente].

5. PERICIAL:

[PENDIENTE: merituar el dictamen pericial: identificar al perito y la especialidad, sintetizar las conclusiones del informe, destacar su fundamentación técnica y científica, indicar si fue impugnado u observado y, en su caso, refutar las impugnaciones; señalar qué hechos controvertidos quedan acreditados con la pericia y su concordancia con la restante prueba].

6. LA PRUEBA DE LA CONTRARIA:

Sin perjuicio de lo expuesto, corresponde señalar que la prueba producida por la contraparte, {{contraparte_nombre}}, resulta insuficiente para acreditar los extremos por ella invocados.

[PENDIENTE: analizar críticamente cada medio de prueba producido por la contraparte, señalando sus deficiencias, contradicciones, orfandad probatoria respecto de los hechos que le incumbía acreditar y su falta de aptitud para desvirtuar la prueba de esta parte].

III. CONCLUSIONES.

Del análisis precedente, efectuado a la luz de las reglas de la sana crítica racional (art. 327 del CPCC), surge con toda claridad que la prueba rendida en autos, valorada en forma individual y en su conjunto, acredita acabadamente los extremos fácticos invocados por mi parte. En efecto:

A. [PENDIENTE: primera conclusión: hecho controvertido acreditado y medios de prueba que lo demuestran].

B. [PENDIENTE: segunda conclusión: hecho controvertido acreditado y medios de prueba que lo demuestran].

C. [PENDIENTE: agregar las conclusiones que correspondan, siguiendo el orden de los hechos controvertidos].

Por el contrario, la contraparte no ha producido prueba idónea ni suficiente que desvirtúe los hechos acreditados por mi parte, ni ha logrado demostrar los extremos cuya prueba le incumbía conforme al principio según el cual quien alega un hecho debe probarlo. [PENDIENTE: adaptar este párrafo según la posición procesal de la parte y la distribución de la carga probatoria en el caso concreto].

En consecuencia, encontrándose acreditados los presupuestos fácticos de la pretensión [PENDIENTE: o, en su caso, la falta de acreditación de los presupuestos de la pretensión de la contraria], corresponde que al momento de resolver V.S. [PENDIENTE: haga lugar a la demanda en todas sus partes / rechace íntegramente la demanda], con costas a la contraria.

IV. PETITUM.

Por todo lo expuesto, a V.S. respetuosamente solicito:

1. Tenga por presentado en tiempo y forma el presente alegato sobre el mérito de la prueba rendida, ordenando su reserva en Secretaría hasta el dictado del decreto de autos.

2. Oportunamente, al dictar sentencia, [PENDIENTE: haga lugar a la demanda promovida por mi parte en todas sus partes / rechace íntegramente la demanda entablada en contra de mi representada], con expresa imposición de costas a la parte contraria.

Proveer de conformidad.

SERÁ JUSTICIA.-$tpl$)
on conflict (id) do update set nombre = excluded.nombre, tipo = excluded.tipo, categoria = excluded.categoria, fuero = excluded.fuero, descripcion = excluded.descripcion, orden = excluded.orden, variables = excluded.variables, contenido = excluded.contenido, updated_at = now();

-- Reclasificación de plantillas demo del estudio de prueba
update public.plantillas set categoria = 'contestacion' where estudio_id is not null and nombre = 'Contesta demanda';
update public.plantillas set categoria = 'recurso' where estudio_id is not null and nombre ilike 'Interpone recurso%';
commit;
