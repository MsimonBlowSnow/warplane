

function setattr(node,style,val){
	node.style[style] = val;
}


window.onload = function(){
	let bg1 = document.getElementsByClassName("first")[0];
	let bg2 = document.getElementsByClassName("second")[0];
	let main = document.getElementsByClassName("main")[0];
	let stbutton = document.getElementsByClassName("stbutton")[0];
	let startflag;
	let me = document.getElementsByClassName('me')[0];
	let windowW = document.body.clientWidth;
	let marginX =(windowW-320)/2;
	let iscreateEnemy = false;
	let enemyarrs = [];
	let buttetarrs = [];
	let constObj = {
		windowW,
		marginX
	}
	
	class Enemy{
		constructor() {
			this.width = 0;
			this.height = 0;
			this.x = 0;
			this.y = -12;
			this.isalive = true;
			this.template = null;
		}
		create(){
			this.x = (Math.floor(Math.random()*303)+17);
			this.template = document.createElement('div');
			let x = this.x;
			let y = this.y;
			this.template.style = "display: none; position: absolute;left: 50%;top: 50%;"
			//确定产生敌机种类
			this.template.classList.add('enemy1');
			this.template.style.left = `${x}px`;
			this.template.style.top = `${y}px`;
			this.template.style.display = "block";
			return this.template;
		}
		move(father){
			// console.log(this.template);
				this.islive = setInterval(()=>{
					if(Buttet.startflag){
						if(this.y>580){
							clearInterval(this.islive);
							father.removeChild(this.template);
							delete this;
						}
						this.y+=10;
						// console.log(this.y,this.template);
						this.template.style.top = `${this.y}px`; 
					}
				},200);
		}
		isshoted(buttets){
			let leftx = this.x-17;
			let rightx = this.x +17;
			let topy = this.y-12;
			let bottomy = this.y+12;
			if((buttets.x>leftx-3&&buttets.x<rightx+3)
				&&(buttets.y<bottomy+6&&buttets.y>topy-6)
			){
				// alert("你已经死了");
				this.isalive = false;
				return true;
			}
		}
		isdie = function(father){
			clearInterval(this.islive);
			father.removeChild(this.template);
			delete this;
		}
	}
	
	class Buttet {
		static startflag = true;
		constructor() {
		    this.speed = 1;
		    this.x = 0,
			this.y = 0
		    this.flyflag = null,
			this.islive = true;
			this.template = null;
		}
		create =  function (x,y){
				this.template = document.createElement('div');
				this.x =x;
				this.y =y;
				this.template.style = "display: none; position: absolute;left: 50%;top: 50%;"
				this.template.classList.add('buttet');
				this.template.style.left = `${x}px`;
				this.template.style.top = `${y}px`;
				this.template.style.display = "block";
				return this.template;
			}
		move = function(father,enemyarrs){
			// console.log(this.template);
				this.flyflag = setInterval(()=>{
					if(Buttet.startflag){
						if(this.y<-14){
							clearInterval(this.flyflag);
							father.removeChild(this.template);
							delete this;
							buttetarrs.shift();
						}
						this.isboom(enemyarrs,father);
						let dindex = -1;
						for (let item of enemyarrs) {
							if(item instanceof Enemy&&!item.isalive){
								dindex = enemyarrs.indexOf(item);
							}
						}
						if(dindex>-1){
							enemyarrs[dindex].isdie(father);
							enemyarrs.splice(dindex,1);
						}
							
						this.y-=10;
						// console.log(this.y,this.template);
						this.template.style.top = `${this.y}px`; 
					}
				},1);
		}
		disappear = function(father){
			if(!this.islive){
				clearInterval(this.flyflag);
				father.removeChild(this.template);
				let myindex =-1;
				myindex = buttetarrs.indexOf(this);
				if(myindex>-1){
					buttetarrs.splice(myindex,1);
				}
				delete this;
			}
		}
		isboom = function (enemyarrs,father){
			if(enemyarrs.length>0){
					for (let item of enemyarrs) {
						if(item instanceof Enemy&&item.isalive){
							if(item.isshoted(this)){
								this.islive = false;
								this.disappear(father);
							}
						}
					}
			}
			
		}
	}
	/* 飞机(我方) */
	let my={
		fly: function (e){
						// console.log(e.clientX,constObj.marginX);
						let x = e.clientX-constObj.marginX;
						let y = e.clientY-100;
						
						if(x<34){
							x = 34;
						}else if(x>286){
							x=286;
						}
						if(y<40){
							y = 40
						}else if(y>528){
							y=528;
						}
						setattr(me,'left',`${x}px`);
						setattr(me,'top',`${y}px`);
		},
		mefly: function(){
				document.onmousemove = function(e){
					my.fly(e);
				}
					
		},
		stop: function(){
			document.onmousemove = null;
			// console.log("清楚事件")
		},
		init:function(enemyarrs){
			setattr(my.node,'display','block');
			my.mefly();
			my.shot(enemyarrs);
		},
		node: me,
		shot: function(enemyarrrs){
				if(this.isshot){
					return 0;
				}
				this.isshot = setInterval(()=>{
					if(startflag){
						let buttet = new Buttet();
						buttetarrs[buttetarrs.length++] = buttet;
						let buttetdom = buttet.create(Number.parseInt(my.node.style.left),Number.parseInt(my.node.style.top));
						main.appendChild(buttetdom);
						buttet.move(main,enemyarrs);
					// console.log(buttet);
					}
				},200);
		}
	};
	
	function startbg(){
		let startbgInt = setInterval(()=>{
			let top1 = Number.parseInt(bg1.style.top);
			let top2 = Number.parseInt(bg2.style.top);
			if(top1<567){
				top1++;
			}else{
				top1 = -568;
			}
			if(top2<567){
				top2++;
			}else{
				top2 = -568;
			}
			setattr(bg1,"top",top1+"px");
			setattr(bg2,"top",top2+"px");
		},1);
		return startbgInt;
	}
	 
	/*暂停*/
	 function stop(){
		 console.log(main);
			main.addEventListener('click',()=>{
				if(startflag){
					clearInterval(startflag);
					startflag = null;
					setattr(stbutton,"display","block");
					my.stop();
					Buttet.startflag = false;
					console.log(enemyarrs);
				}
				
			},true);
	}
	
	function start(){
		stbutton.addEventListener('click',function(){
				if(!startflag){
					startflag = startbg();
					setattr(stbutton,"display","none");
					Buttet.startflag = true;
					if(!iscreateEnemy){
						iscreateEnemy = setInterval(()=>{
							if(startflag){
								console.log("我去")
								let enemy = new Enemy();
								let enemyDom = enemy.create();
								main.appendChild(enemyDom);
								enemy.move(main);
								enemyarrs[enemyarrs.length] = enemy;
							}
						},1000)
					}
					my.init(enemyarrs);
				}
		})
		stop();
	}
	
	/* 清除暂停时清除时间 */
	function clearthing(){
		me.removeEventListener();
	}

	/* 产生敌机 */
	start();
}