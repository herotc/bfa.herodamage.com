import ClassSpec from '../../assets/wow-data/ClassSpec.json'
import Talents from '../../assets/wow-data/Talent.json'
import Trinkets from '../../assets/wow-data/Trinket.json'
import AzeritePowers from '../../assets/wow-data/AzeritePower.json'

/**
 * Get the class id from the class string
 * @param wowClass
 * @returns {*}
 */
export function getWowClassId (wowClass) {
  return ClassSpec[wowClass].classId
}

/**
 * Get the class id and the spec id from the class and spec string
 * @param wowClass
 * @param spec
 * @returns {{classId, specId: *}}
 */
export function getWowClassIdAndSpecId (wowClass, spec) {
  const classSpec = ClassSpec[wowClass]
  const classId = classSpec.classId
  const specId = classSpec.specIds[spec]
  return { classId, specId }
}

/**
 *
 * @param wowClass
 * @param spec
 * @returns {*}
 */
export function getTalentsTree (wowClass, spec) {
  const { classId, specId } = getWowClassIdAndSpecId(wowClass, spec)
  const classTalents = Talents[classId]
  return Object.assign({}, classTalents[specId])
}

/**
 *
 * @param trinketName
 * @returns {*}
 */
export function getTrinketInformation (trinketName) {
  return Trinkets[trinketName]
}

/**
 *
 * @param azeritePowerName
 * @returns {*}
 */
export function getAzeriteInformation (azeritePowerName) {
  return AzeritePowers[azeritePowerName]
}
