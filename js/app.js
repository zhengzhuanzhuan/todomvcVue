;(function () {
	//只需要聚焦一次(bind或者inserted)
	Vue.directive ('focus',{
		// bind(el,binding){
		// 	console.log(el)
		//	el.focus()
		// el.style.color = 'red'
		// },
		inserted:function(el){
			el.focus()
		}
	})
	Vue.directive('todo-focus',{
		update (el,binding){
			// console.log('指令模板更新',el)
			//严谨问题
			// el.focus()
			// console.log(binding.value)
			if(binding.value){
				el.focus()
			}

		}
	})
	// const todos = [
	// 	{
	// 	  id: 1,
	// 	  title: '吃饭',
	// 	  completed: true
	// 	},
	// 	{
	// 	  id: 2,
	// 	  title: '睡觉',
	// 	  completed: false
	// 	},
	// 	{
	// 	  id: 3,
	// 	  title: '写代码',
	// 	  completed: true
	// 	}
	//   ]
	//   JSON.parse转换要求为字符串,引号
	//获取值以键值获取
	//页面刷新数据依旧保存
	  window.app = new Vue({
		data:{
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEdit: null,
			filterText:'all'
		},
		//计算属性
		computed:{
			//显示未选中，未完成的个数
			getremainingCount: {
				get(){
					return this.todos.filter(item => !item.completed).length
				},
				//当app.getremainingCount=xxx,重新赋值的时候会调用set方法
				set (){
					console.log('fdbjfdbnj')
				}
			},
			toggleCompleted :{
				get(){//访问
					//通过下面的选中状态，联动上面的状态
					return this.todos.every(item => item.completed)
				},
				set (){//重新赋值
					//通过上面的选中状态，联动下面的
					// console.log(222)
					//在set中调用get方法,点击得到的状态和get中的一致
					// console.log(this.toggleCompleted)
					// this.toggleCompleted得到的为下面的选中状态,所以取反
					const checked = !this.toggleCompleted
					this.todos.forEach(item => {
						item.completed=checked
					}) 
				}
			},
			filterTodos(){
				//all todos 
				//active this.todos.filter(item => !item.completed)
				//completed this.todos.filter(item => item.completed)
				switch(this.filterText){
					case 'active':
					return this.todos.filter(item => !item.completed)
					break
					case 'completed':
					return this.todos.filter(item => item.completed)
					break
					default:
					return this.todos
					break
				}
			}
		},
		//监视todos的值
		watch: {
			todos:{
				handler(val,oldVal){
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
				},
				//深度监视
				deep:true,
			}
		},
		methods:{
			//获取输入框的内容，添加到todos
			handleAddData (e){
				// console.log(111)
				const  target = e.target
				const value =target.value.trim()
				// console.log(value)
				//判断输入框的值是否为空
				if(!value.length){
					return
				}
				//将数据添加到todos中
				const todo = this.todos
				todo.push({
					//如果数组长都为0,id没值就会报错
					id: todo.length? todo[todo.length - 1].id + 1: 1,
					title: value,
					completed: false
				})
				//存储todos的值
				window.localStorage.setItem('todos',JSON.stringify(this.todos))
				//清空输入框
				target.value = ''
				// value = ''
			},
			//点击叉号删除事件
			handleDeleteClick (index){
				// console.log(11)
				this.todos.splice(index,1)
			},
			//点击按钮切换选择状态
			handleToggleAllChange(e){
				// console.log(e)
				//获取checked的选中状态,值为true和false
				const checked = e.target.checked
				// console.log(checked)
				//循环遍历子任务项里面的选中状态和标题中的一样
				this.todos.forEach(item => {
					item.completed=checked
				})
			},
			//变量等于当前双击的todoes
			//双击的时候两者相等，值为true,应用editing类样式
			handleEditdbclick (item){
				// console.log(item)
				this.currentEdit =item
				// console.log(this.currentEdit)
			},
			//按下enter键保存编辑信息
			handleSaveMessEnter(item,index,e){
				const target = e.target
				const value = target.value.trim()
				// console.log(value)
				if(!value.length){
					this.todos.splice(index,1)
				}else {
					item.title =value
					// console.log(item.title)
					//移除edit的类样式
					this.currentEdit =null
				}
			},
			//按esc键退出编辑
			handleCancleEditEsc (){
				// console.log(1)
				//移除类样式，取消编译
				this.currentEdit =null
			},
			//点击清除已经完成的
			handleCompletedClick (){
				// for(let i=0;i<this.todos.length;i++){
				// 	if(this.todos[i].completed){
				// 		this.todos.splice(i,1)
				// 		i--
				// 	}
				// }
				//没有选中的过滤出来重新赋值给todos
				this.todos = this.todos.filter(item => !item.completed)
			}
		}
		
	  }).$mount('#app')
	  //hash
	//   console.log(window)
	  window.onhashchange= function(){
		//   console.log(window.location.hash.substr(2))
		app.filterText=window.location.hash.substr(2)
	  }
	  
})();

// var arr =[1,2,3,4,5,6]
// //数组的每一项和2取余都为0===true
// arr.every(item => item%2 === 0 )
// //数组的只要有一项和2取余为0===true
// arr.some(item => item%2 === 0 )
//forEach循环
//以键值的方式存储，值必须为字符串
// window.localStorage.setItem('a',{})
//取值的时候以键值来取会把对象转为字符串
// window.localStorage.getItem('a')
