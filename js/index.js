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
	let score = 0;
	let startbgInt;
	let p = document.getElementsByTagName("p")[0];
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
			this.isdying = false;
			this.template = null;
			this.clearTimer = 0;
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
		move(){
			// console.log(this.template);
				this.islive = setInterval(()=>{
					if(Buttet.startflag){
						if(this.y>580){
							clearInterval(this.islive);
							main.removeChild(this.template);
							delete this;
						}
						this.y+=10;
						// console.log(this.y,this.template);
						this.template.style.top = `${this.y}px`; 
					}
				},200);
		}
		isshoted(buttets){
			if(this.isalive){
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
		}
		isdie(){
			if(!this.isdying){
				score++;
				this.isdying = true;
				this.template.classList.add('enemy1boom');
				this.clearTimer = setTimeout(()=>{
					clearInterval(this.islive);
					main.removeChild(this.template);
					delete this;
				},1000);
				p.innerText = `成绩: ${score}`;
			}
			
		}
		
		static init(){
			for (let item of enemyarrs) {
				if(item instanceof Enemy){
					clearTimeout(item.clearTimer);
					item.clearTimer = null;
					clearInterval(item.islive);
					item.islive = null;
					main.removeChild(item.template);
					delete this
				}
				
			}
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
							enemyarrs[dindex].isdie();
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
		static init(){
			for (let item of buttetarrs) {
				if(item instanceof Buttet){
					clearInterval(item.flyflag);
					item.flyflag = null;
					main.removeChild(item.template);
					let myindex =-1;
					myindex = buttetarrs.indexOf(item);
					if(myindex>-1){
						buttetarrs.splice(myindex,1);
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
			my.node.style.left = '160px';
			my.node.style.top = '284px';
			setattr(my.node,'display','block');
			my.mefly();
			my.shot(enemyarrs);
			my.iscoll(enemyarrs);
		},
		iscolltimer: null,
		node: me,
		shot: function(enemyarrs){
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
		},
		iscoll: function(enemyarrs){
			if(!this.iscolltimer){
				this.iscolltimer = setInterval(()=>{
						let y = Number.parseInt(my.node.style.top);
						let x = Number.parseInt(my.node.style.left);
						for (let item of enemyarrs) {
							//width: 34px; height: 24px; 66 80
							if(item instanceof Enemy && item.isalive){
								// console.log(x,y,item.x,item.y);
								// console.log(my.node.style.left);
								if((item.x>x-50&&item.x<x+50)&&(item.y>y-52&&item.y<y+52)){
									alert(`游戏结束,你本次得分${score}`);
									init();
									return ;
								}
							}
						}
				},10);
			}
		},
		
		gameOver: function(){
			this.node.style.display = "none";
			//清除自己的定时器
			clearInterval(my.iscolltimer);
			this.iscolltimer = null;
			clearInterval(this.isshot);
			this.isshot = null;
		}
	};
	
	function startbg(){
			startbgInt = setInterval(()=>{
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

	function init(){
		let sonNodes = main.childNodes;
		my.node.style.display = "none";
		stbutton.style.display = "block";
		console.log('执行了');
		//清除产生敌机定时器
		clearInterval(iscreateEnemy);
		iscreateEnemy = null;
		//清除背景运动
		clearInterval(startflag);
		startflag = null;
		score = 0;
		p.innerText =`成绩: ${score}`;
		Enemy.init();
		Buttet.init();
		my.gameOver();
		enemyarrs = [];
		buttetarrs = [];
	}
	/* 产生敌机 */
	start();
}