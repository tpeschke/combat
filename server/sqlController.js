makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const axios = require('axios')
const config = require('./config.js')

module.exports = {
    getAllCombats: (req, res) => {
        const db = req.app.get('db')

        var { id } = req.user

        db.get.all_Combats(id).then(result => res.status(200).send(result))

    },

    loadCombatants: (req, res) => {
        const db = req.app.get('db')
        var { id } = req.params
        
        db.get.combatants(id).then(result => {
            result.forEach(v => {
                if (isNaN(+v.actioncount)) {
                    v.actioncount = v.actioncount.split(",")
                } else {
                    v.actioncount = +v.actioncount
                }
            })
            let tempArr = []
            result.forEach(val => tempArr.push(db.get.weapon(val.id).then(weapons => {
                selected = weapons.filter(v => v.selected === '1')
                if (selected.length === 0) {
                    weapons.push({weapon: 'Unarmed', speed: 10, encumb: 10, selected: '1'})
                    val.encumbrance = 10;
                } else {
                    val.encumbrance = selected[0].encumb
                }
                return { ...val, weapons }
            })))

            Promise.all(tempArr).then(final => {
                res.send(final)
            })
        })
    },

    getAllStatuses: (req, res) => {

        const db = req.app.get('db')

        var { id } = req.params

        db.get.all_Statuses(id).then(result => res.status(200).send(result))
    },

    getHash: (req, res) => {
        const db = req.app.get('db')

        var { id } = req.params

        db.get.hash(id).then(result => res.status(200).send(result))
    },

    getBattleByHash: (req, res) => {
        const db = req.app.get('db')

        var { hash } = req.params

        db.get.battle_By_Hash(hash).then(result => res.send(result))
    },

    getCombatantsbyHash: (req, res) => {
        const db = req.app.get('db')

        var { hash } = req.params;

        db.get.fighter_By_Hash(hash).then(a => {
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
        axios.get(config.beastiaryEndpoint + '/api/combat/' + req.params.hash).then(result => res.send(result.data))
    },
    newField: (req, res) => {
        var urlhash = makeid()

        const db = req.app.get('db')
        var { id, patreon } = req.user

        db.get.totalFieldNumber(id).then(totalCount => {
            if (+totalCount[0].count >= 1 && !patreon) {
                res.status(403).send('You need to link your Patreon to this account to add more fields. You can do so by logging on through the BonfireSRD')
            } else if (totalCount[0].count === '0' || +totalCount[0].count <= patreon ) {
                db.get.newFieldNumber(id)
                    .then(num => {
                        let newName = 'New Battlefield'
                        if (num[0].count !== '0') {
                            newName = 'New Battlefield ' + num[0].count
                        }
                        db.add.new_Field(newName, id, urlhash)
                            .then(result => res.status(200).send(result))
                    })
            } else if (totalCount[0].count > patreon ) {
                res.status(403).send('To add more fields, you need to increase your Patreon Tier')
            }
        })
    },

    deleteField: (req, res) => {

        const db = req.app.get('db')

        let { id } = req.params
            , { user } = req

        db.delete.field(id, user.id).then(result => res.status(200).send(result))
    },

    saveField: (req, res) => {

        var { combatName, count, combatId, fighterList, statusList } = req.body

        const db = req.app.get('db')
        var { combatId } = req.body

        var tempArr = []

        fighterList.forEach(val => {
            if (!isNaN(val.id)) {
                db.update.fighters(val.namefighter, val.colorcode, !isNaN(val.actioncount) ? `${val.actioncount}` : `${val.actioncount[0]},${val.actioncount[1]}`, val.topcheck, val.acting, val.dead, val.hidden, val.max_health, val.health, val.stress, val.panic, val.broken, val.stressthreshold, val.id).then(r => {
                    val.weapons.forEach(w => {
                        console.log(val.namefighter, w)
                        if (!isNaN(w.id)) {
                            tempArr.push(db.update.weapons(val.id, w.weapon, w.selected, w.speed, w.id, w.encumb, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype).then().catch(e => console.log("----------113")))
                        } else if (isNaN(w.id)) {
                            tempArr.push(db.add.weapons(val.id, w.weapon, w.selected, +w.speed, +w.encumb, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype).then().catch(e => console.log("----------115")))
                        }
                    })
                }).catch(e => console.log(e))
            } else {
                db.add.fighter(val.namefighter, val.colorcode, !isNaN(val.actioncount) ? `${val.actioncount}` : `${val.actioncount[0]},${val.actioncount[1]}`, val.topcheck, val.acting, val.dead, combatId, val.hidden, val.max_health, val.health, val.stress, val.panic, val.broken, val.stressthreshold).then(v => {
                    val.weapons.forEach(w => {
                        tempArr.push(db.add.weapons(v[0].id, w.weapon, w.selected, +w.speed, w.encumb, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype).then())
                    })
                }).catch(_ => console.log('140------------------------------------------'))
            }
        })

        statusList.forEach(val => {
            val.timestatus <= 0 ? tempArr.push(db.delete.status(val.id).then()) : null;
            if (!isNaN(val.id)) {
                tempArr.push(db.update.status(val.namestatus, val.timestatus, val.id).then())
            } else {
                tempArr.push(db.add.status(val.namestatus, val.timestatus, combatId).then())
            }
        })

        tempArr.push(db.update.field(count, combatName, req.body.combatId).then())

        // Reload the field with the new IDs
        Promise.all(tempArr).then(_ => {
            db.get.combatants(combatId).then(result => {
                result.forEach(v => {
                    if (isNaN(+v.actioncount)) {
                        v.actioncount = v.actioncount.split(",")
                    } else {
                        v.actioncount = +v.actioncount
                    }
                })
                let loadArr = []
                result.forEach(val => loadArr.push(db.get.weapon(val.id).then(weapons => {
                    return { ...val, weapons }
                })))

                Promise.all(loadArr).then(fighters => {
                    db.get.all_Statuses(combatId).then(statuses => res.send([fighters, statuses]))
                })
            })
        })

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

    deleteFighter: (req, res) => {

        const db = req.app.get('db')

        var { id } = req.params

        db.delete.fighter(id).then()
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