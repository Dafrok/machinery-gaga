import plugin from '../../lib/plugins/plugin.js'

const RepStore = {}

export class repeat extends plugin {
  constructor () {
    super({
      name: 'Repeater',
      dsc: 'Repeat once after several +1',
      event: 'message',
      priority: 0,
      rule: [
        {
          reg: '.',
          fnc: 'repeat'
        }
      ]
    })
  }

  repeat (e) {
    if (!e.group_id) {
      return
    }
    if (!RepStore[e.group_id]) {
      RepStore[e.group_id] = {
        msgToRepeat: '',
        msgUserSet: new Set(),
        repeated: false
      }
    }
    const groupObj = RepStore[e.group_id]
    if (e.message?.[0]?.type === 'text' && e.message?.[0]?.text == groupObj.msgToRepeat) {
      groupObj.msgUserSet.add(e.user_id)
    } else {
      groupObj.repeated = false
      groupObj.msgUserSet.clear()
      groupObj.msgToRepeat = e.message?.[0]?.text
      groupObj.msgUserSet.add(e.user_id)
    }
    if (!groupObj.repeated && groupObj.msgUserSet.size == 3) {
      groupObj.repeated = true
      this.reply(groupObj.msgToRepeat)
    }
  }
}
