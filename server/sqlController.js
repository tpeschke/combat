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
                    selected = weapons.filter(v => v.selected === '1')
                    if (selected.length === 0) {
                        weapons.push({ weapon: 'Unarmed', speed: 10, encumb: 10, selected: '1' })
                        val.selected = { weapon: 'Unarmed', speed: 10, encumb: 10, selected: '1' }
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
        axios.get(config.beastiaryEndpoint + '/api/combat/' + req.params.hash, { query: { patreon: req.user.patreon } }).then(result => res.send(result.data))
    },
    newField: (req, res) => {
        var hash = makeid()
        const db = req.app.get('db')
        var { id, patreon } = req.user
        db.get.totalFieldNumber(id).then(totalCount => {
            if (+totalCount[0].count >= 1 && !patreon) {
                res.status(403).send({ message: 'You need to link your Patreon to this account to add more fields. You can do so by logging on through the BonfireSRD' })
            } else if (totalCount[0].count === '0' || +totalCount[0].count <= patreon) {
                db.upsert.field(id, 'New Battlefield', hash, 1).then(result => res.send({ hash }))
            } else if (totalCount[0].count > patreon) {
                res.status(403).send({ message: 'To add more fields, you need to increase your Patreon Tier' })
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
        fighters.forEach(val => {
            db.upsert.fighter(val.namefighter, val.colorcode, val.actioncount.length ? `${val.actioncount}` : `${val.actioncount[0]},0`, val.topcheck, val.acting, val.dead, val.hidden, val.max_health, val.health, val.stress, val.panic, val.broken, val.stressthreshold, val.id, meta.id).then(result => {
                val.weapons.forEach(w => {
                    tempArray.push(db.upsert.weapon(val.id, w.weapon, w.selected, w.speed, w.encumb, w.atk, w.init, w.def, w.dr, w.shield_dr, w.measure, w.damage, w.parry, w.weapontype, w.id).then())
                })
            })
        })
        statuses.forEach(val => {
            if(val.timestatus - meta.count <= 0) {
                tempArray.push(db.delete.status(val.id).then())
            } else {
                tempArray.push(db.upsert.status(val.namestatus, val.timestatus, val.description, val.colorcode, val.playerdescription, val.playerview, val.id, meta.id).then())
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