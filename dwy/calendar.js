$(function(){
	init();
	//开始或结束日期的tab
	var strat_end_index = 0;
	$('.main-con').click(function(){
		strat_end_index = $(this).index();
		$(this).find('.main-head').addClass('tab-active');
		$(this).siblings().find('.main-head').removeClass('tab-active');
		$('.calendar td').each(function(i){
			if($(this).hasClass('check-active')){
				$(this).removeClass('check-active');
			}
		});
		
	});
	//选择具体日期
	var d = '';
	var m = '';
	var m_arr = [0];
	$('.calendar-show tr td').click(function(){
		d = $(this).text();
		m = $(this).parents('.table-msg').siblings('.calendar-head').find('.month').text();
		m_arr.push(parseInt(m));
		//多次点击，始终保证一个数组2个值，做比较
		if(m_arr.length == 3){
			m_arr.splice(0,1);
		}
		$(this).addClass('check-active');
		if(m_arr[0] == m_arr[1] || m_arr[0] == 0){
			$(this).addClass('check-active').siblings('td').removeClass('check-active');
			$(this).parent('tr').siblings().each(function(){
				$(this).find('td').removeClass('check-active');
			});
		}else if(m_arr[0] != m_arr[1] || m_arr[0] != 0){
			//console.log($('.calendar-show:eq('+m_arr[0]+') tr td'))
			$('.calendar-show:eq('+(m_arr[0]-1)+') tr td').each(function(){
				$(this).removeClass('check-active');
			});
		}
		
	});
	
	$('#sure').click(function(){
		if(d != ''){
			var tab_index = null;
			if(strat_end_index == 0){
				tab_index = 1;
			}else{
				tab_index = 0;
			}
			//结束时间不能大于或等于开始时间
			var _m = parseInt($('.main-con:eq('+tab_index+') .main-foot .month').text());
			var _d = parseInt($('.main-con:eq('+tab_index+') .main-foot .day').text());
			//console.log(_m);
			//console.log(m)
			//strat_end_index == 0 --开始时间-结束时间
			//strat_end_index == 1 --结束时间-开始时间
			if(strat_end_index == 0){
				if(m > _m){
					slide();
				}else if(m == _m && d >= _d){
					slide();
				}else{
					$('.main-con:eq('+strat_end_index+') .main-foot .month').text(m);
					$('.main-con:eq('+strat_end_index+') .main-foot .day').text(d);
				}
			}else{
				if(m < _m){
					slide();
				}else if(m == _m && d <= _d){
					slide();
				}else{
					$('.main-con:eq('+strat_end_index+') .main-foot .month').text(m);
					$('.main-con:eq('+strat_end_index+') .main-foot .day').text(d);
				}
			}
			
		}else{
			if(strat_end_index == 0){
				$(this).text('请选择开始日期');
			}else{
				$(this).text('请选择结束日期');
			}
			setTimeout(function(){
				$('#sure').text('确定');
			},1500);
		}
		
	});
	
	
	//判断为闰年
	function leapYear(year){
		if((year%4 == 0 && (year%100) != 0) || year%400 ==0){
			return 1;
		}else{
			return 0;
		}
	}
	
	//开始时间不能大于结束时间
	function slide(){
		$('#notice').slideDown();
		setTimeout(function(){
			$('#notice').slideUp();
		},2000);
	}
	
	function init(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		var isLeapYear = leapYear(year);
		var month_lastDay = [31,28+isLeapYear,31,30,31,30,31,31,30,31,30,31];
		var day = date.getDate();
		var active_day = String(year)+String(month)+String(day);
		//以当前月为最开始显示
		$('.calendar-show:lt('+month+')').css('display','none');
		
		$('.year').text(year);
		$('.month').text(month+1);
		$('.day:eq(0)').text(day);
		$('.day:eq(1)').text(day+1);
		var will_month_arr = [];
		var firstDay_arr=[];
		for(var i= month;i<12;i++){
			$('.calendar .month:eq('+i+')').text(i+1);
			//判断行数
			var setFirstDay = new Date(year,i,1);
			var getFirstDay = setFirstDay.getDay();
			firstDay_arr.push(getFirstDay);
			var rows = Math.ceil((getFirstDay+month_lastDay[i])/7);
			will_month_arr.push(rows);
		}
		// 不同月的填充对应的行数
		will_month_arr.forEach(function(value,index,arr){
			for(var i= 0;i<arr[index];i++){
//				var tr = document.createElement('tr');
				var tr = $('<tr></tr>');
				for(var j= 0;j<7;j++){
					//var td = document.createElement('td');
					var td = $('<td></td>');
					tr.append(td);
				}
				var add_tr_num = 12-arr.length+index;
				$('.table-msg:eq('+add_tr_num+')').append(tr);
				
			}
			//如果该月的第一天在星期日
			var _first = null;
			if(firstDay_arr[index] == 0){
				_first = firstDay_arr[index];
			}else{
				_first = firstDay_arr[index]-1;
			}
			//填日期
			$('.table-msg:eq('+add_tr_num+') tr td:gt('+_first+')').each(function(i){
				if(i < month_lastDay[add_tr_num]){
					$(this).text(i+1);
				}
				//当前号数显示为高亮
				if(add_tr_num == date.getMonth() && (i+1) == day){
					$(this).addClass('active');
				}
				if(add_tr_num == date.getMonth() && (i+1) < day){
					$(this).text(i+1).css('color','#ccc');
				}
			});
			
		});
	}
	
});
