makeid = (length = 10) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

getEncounter = (db, encounterHash, hash) => {
    return new Promise(resolve => {
        let battlefield = {}
        db.get.singleFieldByEncounter(encounterHash).then(field => {
            if (field.length === 0) {
                resolve({ color: "red", message: `"${encounterHash}" is not a valid hash.` })
            } else {
                battlefield.meta = field[0]
                battlefield.meta.hash = hash
                db.get.combatants(battlefield.meta.id).then(result => {
                    result.forEach(v => {
                        if (isNaN(+v.actioncount)) {
                            v.actioncount = v.actioncount.split(",")
                        } else {
                            v.actioncount = +v.actioncount
                        }
                    })
    
                    let tempArr = []
                    result.forEach(val => tempArr.push(db.get.weapon(val.id).then(weapons => {
                        val.id = makeid();
                        weapons = weapons.map(weapon => {
                            weapon.id = makeid()
                            return weapon
                        })
                        selected = weapons.filter(v => {
                            return v.selected === '1'
                        })
                        if (selected.length === 0) {
                            weapons.push({ id: makeid(), weapon: 'Unarmed', speed: 10, fatigue: 'C', selected: '1' })
                            val.selected = { id: makeid(), weapon: 'Unarmed', speed: 10, fatigue: 'C', selected: '1' }
                        } else {
                            val.selected = selected[0]
                        }
                        console.log(weapons)
                        return { ...val, weapons }
                    })))
    
                    tempArr.push(db.get.allStatuses(battlefield.meta.id).then(statuses => {
                        statuses = statuses.map(val => {
                            val.id = makeid()
                            return val
                        })
                        battlefield.statuses = statuses
                        return true;
                    }))
    
                    Promise.all(tempArr).then(final => {
                        battlefield.fighters = final.filter(val => val.id)
                        resolve(battlefield)
                    })
                })
            }
        })
    })
}

saveEncounter = (db, userId, { meta, fighters, statuses }) => {
    return new Promise(resolve => {
        var tempArray = []

        db.upsert.field(userId, meta.name, meta.hash, meta.count).then(field => {
            meta.id = field[0].id
            fighters.forEach(val => {
                db.upsert.fighter(val.namefighter, val.colorcode, typeof val.actioncount === 'number' ? `${val.actioncount}` : `${val.actioncount[0]},0`, val.topcheck, val.acting, val.dead, val.hidden, val.max_health, val.health, val.stress, val.panic, val.stressthreshold, val.id, meta.id).then(result => {
                    val.weapons.forEach(w => {
                        tempArray.push(db.upsert.weapon(val.id, w.weapon, w.selected, w.speed, w.fatigue, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype, w.id, w.damagetype).then().catch(e => console.log(e)))
                        if (w.maxrange) {
                            tempArray.push(db.upsert.ranges(w.id, w.maxrange).then().catch(e => console.log(e)))
                        } else if (w.maxrange === 0) {
                            tempArray.push(db.delete.range(w.id).then().catch(e => console.log(e)))
                        }
                    })
                }).catch(e => console.log("--------------------------------------------------", e))
            })
            statuses.forEach(val => {
                if (val.timestatus - meta.count <= 0 && !val.interval) {
                    tempArray.push(db.delete.status(val.id).then())
                } else {
                    tempArray.push(db.upsert.status(val.namestatus, val.timestatus, val.description, val.colorcode, val.playerdescription, val.playerview, val.interval, val.id, meta.id).then())
                }
            })

            Promise.all(tempArray).then(finalArray => resolve(true))
        })
    })
}

const axios = require('axios');
const config = require('./config.js')

module.exports = {
    getAllFields: (req, res) => {
        const db = req.app.get('db')

        var { id } = req.user

        db.get.allFields(id).then(result => res.status(200).send(result))

    },

    getSingleBattle: (req, res) => {
        const db = req.app.get('db')
        let { hash } = req.params
        var { id: userId } = req.user
            , battlefield = {}

        db.get.singleField(userId, hash).then(field => {
            battlefield.meta = field[0]
            db.get.combatants(battlefield.meta.id).then(fighters => {
                fighters.forEach(v => {
                    if (isNaN(+v.actioncount)) {
                        v.actioncount = v.actioncount.split(",")
                    } else {
                        v.actioncount = +v.actioncount
                    }
                })

                let tempArr = []
                fighters.forEach(val => tempArr.push(db.get.weapon(val.id).then(weapons => {
                    selected = weapons.filter(v => {
                        if (v.measure) {
                            v.measure = v.measure.replace(/\.?0+$/, '')
                        }
                        return v.selected === '1'
                    })
                    if (selected.length === 0) {
                        weapons.push({ weapon: 'Unarmed', speed: 10, fatigue: 'C', selected: '1' })
                        val.selected = { weapon: 'Unarmed', speed: 10, fatigue: 'C', selected: '1' }
                    } else {
                        val.selected = selected[0]
                    }
                    return { ...val, weapons }
                })))

                tempArr.push(db.get.allStatuses(battlefield.meta.id).then(statuses => {
                    battlefield.statuses = statuses
                    return true;
                }))

                Promise.all(tempArr).then(final => {
                    battlefield.fighters = final
                    if (req.user) {
                        battlefield.owner = (userId === 1 || userId === 21)
                    }
                    res.send(battlefield)
                })
            })
        })
    },

    getFieldByHash: (req, res) => {
        const db = req.app.get('db')

        var { hash } = req.params

        db.get.fieldByHash(hash).then(result => res.send(result))
    },

    getBattleByHash: (req, res) => {
        const db = req.app.get('db')

        var { hash } = req.params;

        db.get.battleByHash(hash).then(a => {
            let tempArr = []
            a.forEach(f => {
                tempArr.push(db.get.weapon_by_hash(f.id).then(w => {
                    if (w[0]) {
                        return { ...f, weapon: w[0].weapon }
                    }
                    return { ...f, weapon: 'Unarmed' }
                })
                )
            })
            Promise.all(tempArr).then(fighters => {
                db.get.status_By_Hash(hash).then(statuses => {
                    res.send([fighters, statuses])
                })
            })
        })

    },
    getBeastbyHash: (req, res) => {
        axios.get(config.beastiaryEndpoint + '/api/combat/' + req.params.hash).then(result => res.send(result.data)).catch(e => res.send(e))
    },
    getCharacterFromVault: (req, res) => {
        axios.get(config.vaultEndpoint + '/api/character/' + req.params.id).then(result => res.send(result.data))
    },
    getBeastForPlayer: (req, res) => {
        axios.get(config.beastiaryEndpoint + '/api/combat/' + req.params.hash).then(result => res.send(result.data))
    },
    newField: (req, res) => {
        const db = req.app.get('db')
        let hash = makeid(5)
            , { id: userId, patreon } = req.user
            , { hash: encounterHash } = req.query

        db.get.totalFieldNumber(userId).then(totalCount => {
            if (+totalCount[0].count >= 1 && !patreon) {
                res.send({ color: "yellow", message: 'You need to link your Patreon to this account to add more fields. You can do so by logging on through the BonfireSRD' })
            } else if (totalCount[0].count === '0' || +totalCount[0].count <= patreon) {
                if (encounterHash) {
                    getEncounter(db, encounterHash, hash).then(result => {
                        if (result.message) {
                            res.send(result)
                        } else {
                            saveEncounter(db, userId, result).then(result2 => {
                                res.send({ hash })
                            })
                        }
                    }).catch(e => console.log(e))
                } else {
                    db.upsert.field(userId, 'New Battlefield', hash, 1).then(result => res.send({ hash }))
                }
            } else if (totalCount[0].count > patreon) {
                res.send({ color: "red", message: 'To add more fields, you need to increase your Patreon Tier' })
            }
        })
    },

    deleteField: (req, res) => {
        const db = req.app.get('db')
        let { id } = req.params
            , { user } = req
        db.delete.field(id, user.id).then(result => res.send(result))
    },

    saveField: (req, res) => {
        let { meta, fighters, statuses } = req.body
            , { user } = req
        const db = req.app.get('db')
        var tempArray = []

        tempArray.push(db.upsert.field(user.id, meta.name, meta.hash, meta.count).then())
        if (meta.encounter) {
            tempArray.push(db.upsert.encounter(meta.hash, meta.encounter).then())
        }
        fighters.forEach(val => {
            db.upsert.fighter(val.namefighter, val.colorcode, typeof val.actioncount === 'number' ? `${val.actioncount}` : `${val.actioncount[0]},0`, val.topcheck, val.acting, val.dead, val.hidden, val.max_health, val.health, val.stress, val.panic, val.stressthreshold, val.caution, val.id, meta.id).then(result => {
                val.weapons.forEach(w => {
                    tempArray.push(db.upsert.weapon(val.id, w.weapon, w.selected, w.speed, w.fatigue, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype, w.id, w.damagetype).then())
                    if (w.maxrange) {
                        tempArray.push(db.upsert.ranges(w.id, w.maxrange).then())
                    } else if (w.maxrange === 0) {
                        tempArray.push(db.delete.range(w.id).then())
                    }
                })
            }).catch(e => console.log("--------------------------------------------------", e))
        })
        statuses.forEach(val => {
            if (val.timestatus - meta.count <= 0 && !val.interval) {
                tempArray.push(db.delete.status(val.id).then())
            } else {
                tempArray.push(db.upsert.status(val.namestatus, val.timestatus, val.description, val.colorcode, val.playerdescription, val.playerview, val.interval, val.id, meta.id).then())
            }
        })

        Promise.all(tempArray).then(finalArray => res.send({ finished: true }))
    },

    setTooltip: (req, res) => {

        const db = req.app.get('db')

        var { id, tooltip } = req.body

        db.update.tooltip(tooltip, id).then(result => res.send())
    },

    setTheme: (req, res) => {

        const db = req.app.get('db')

        let { theme } = req.params
        let { id } = req.user

        db.update.theme(theme, id).then(result => res.send())
    },

    getTooltips: (req, res) => {
        const db = req.app.get('db')
        let { id } = req.user
        db.get.tooltips(id).then(result => {
            if (result.length > 0) {
                res.send(result[0])
            } else {
                db.add.tooltips(id).then(result => {
                    res.send(result[0])
                })
            }
        })
    },

    updateTooltips: (req, res) => {
        const db = req.app.get('db')
        let { id } = req.user
            , { type, value } = req.body
        if (id) {
            let sqlScript = `update cctooltips set ${type} = ${value} where userid = ${id}`
            db.query(sqlScript).then(result => res.send(result))
        }
    },

    deleteFighter: (req, res) => {
        const db = req.app.get('db')
        var { id } = req.params
        db.delete.fighter(id).then(_ => {
            res.send({message: 'done'})
        })
    },

    deleteStatus: (req, res) => {
        const db = req.app.get('db')
        var { id } = req.params
        db.delete.status(id).then()
    },

    deleteWeapon: (req, res) => {
        const db = req.app.get('db')
        var { id } = req.params
        db.delete.weapon(id).then()
    }

}