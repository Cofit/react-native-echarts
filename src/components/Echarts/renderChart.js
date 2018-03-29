import echarts from './echarts.min';
import toString from '../../util/toString';
import { Platform } from 'react-native';

export default function renderChart(props) {
  const height = `${props.height || 400}px`;
  const width = props.width ? `${props.width}px` : 'auto';
  return `
    document.getElementById('main').style.height = "${height}";
    document.getElementById('main').style.width = "${width}";
    document.body.addEventListener('touchmove', function(event) {
      if('${Platform.OS}' === 'android'){
        window.postMessage('{ "type":"move"}')
      }
    }, false);
    document.body.addEventListener('touchend', function(event) {
      let option = echarts.init(document.getElementById('main')).getOption();
      option = JSON.stringify(option);
      window.postMessage('{ "type":"option" , "option":'+option+' }');
    }, false);
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(${toString(props.option)});
    window.document.addEventListener('message', function(e) {
      var option = JSON.parse(e.data);
      myChart.setOption(option);
    });
    myChart.on('click', function(params) {
      var seen = [];
      var paramsString = JSON.stringify(params, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      });
      window.postMessage(paramsString);
    });
  `
}