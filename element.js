import Vue from 'vue'
import { Button, Form, FormItem, Input, Card, Container, Header, Aside, Main, Message } from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$message = Message
