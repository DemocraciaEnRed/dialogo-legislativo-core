const DocumentTag = require('../models/documentTag')
const { ErrNotFound } = require('../services/errors')

exports.get = function get (query) {
  return DocumentTag.findOne(query)
}

exports.getAll = function getAll (query) {
  return DocumentTag.find(query)
}

exports.loadIfNotExists = function loadIfNotExists (query) {
  const count = DocumentTag.count({})

  if (count > 0) {
    throw new Exception(`There are already ${count} document tags loaded in the database.`)
  }

  const categorías = [
    { name: 'Ambiente', key: 'ambiente' },
    { name: 'Asuntos constitucionales', key: 'asuntos-constitucionales'},
    { name: 'Comunicación social', key: 'comunicacion-social'},
    { name: 'Cultura', key: 'cultura' },
    { name: 'Defensa de los consumidores y usuarios',key: 'defensa-consumidores-usuarios'},
    { name: 'Derechos Humanos, garantías y antidiscriminación', key: 'derechos-humanos-garantias-antidiscriminacion' },
    { name: 'Desarrollo económico, Mercosur, y políticas de empleo',key: 'desarrollo-economico-mercosur-empleo'},
    { name: 'Descentralización y participación ciudadana',key: 'descentralizacion-participacion-ciudadana'},
    { name: 'Educación, ciencia y tecnología', key: 'educacion-ciencia-tecnologia' },
    { name: 'Justicia',key: 'justicia'},
    { name: 'Legislación del trabajo',key: 'legislacion-trabajo'},
    { name: 'Legislación General',key: 'legislacion-general'},
    { name: 'Obras y servicios públicos',key: 'obras-servicios-publicos'},
    { name: 'Planeamiento urbano',key: 'planeamiento-urbano'},
    { name: 'Presupuesto, Hacienda, Administración Financiera y Política Tributaria',key: 'presupuesto-hacienda-administracion-financiera-politica-tributaria'},
    { name: 'Protección y uso del espacio público',key: 'proteccion-uso-espacio-publico'},
    { name: 'Relaciones Interjurisdiccionales',key: 'relaciones-interjurisdiccionales'},
    { name: 'Salud', key: 'salud' },
    { name: 'Seguridad', key: 'seguridad' },
    { name: 'Turismo y Transporte', key: 'turismo-transporte' },
    { name: 'Turismo y deporte', key: 'turismo-deporte' },
    { name: 'Vivienda',key: 'vivienda'},
    { name: 'Mujeres, géneros y diversidades',key: 'mujeres-generos-diversidades'},
    { name: 'Niñez, adolescencia y juventud',key: 'niniez-adolescencia-juventud'},
    { name: 'Discapacidad',key: 'discapacidad'},
    { name: 'Políticas de Promoción e integración social',key: 'politicas-promocion-integracion-social'}
  ]

  return DocumentTag.deleteMany({}).then(() =>
    DocumentTag.insertMany(
      categorías.map((c) => { return { name: c.name, key: c.key } })
    ).then(() => {
      console.log('DocumentTags loaded')
      return this.getAll()
    }).catch((error) => {
      console.log('DocumentTags load error')
      console.log(error)
    })
  )
}

exports.create = function create (data) {
  return (new DocumentTag(data)).save()
}

exports.remove = function remove (id) {
  return DocumentTag.findById(id)
    .then((like) => {
      if (!like) throw ErrNotFound('DocumentTag to remove not found')
      return like.remove()
    })
}
