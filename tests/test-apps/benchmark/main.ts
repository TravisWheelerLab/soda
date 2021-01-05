import * as soda from "@traviswheelerlab/soda"
import {uniformBenchAnn} from '../ann'
import {BenchmarkChart, BenchmarkRenderParams} from "./BenchmarkChart";

let chart = new BenchmarkChart({selector: '#track-chart', binHeight: 14});

let zoomController = new soda.ZoomController();
let resizeController = new soda.ResizeController();
zoomController.addComponent(chart);
resizeController.addComponent(chart);
window.onresize = () => resizeController.trigger();

function submit() {
    let n = parseInt((<HTMLInputElement>document.getElementById('n')).value);
    let glyph: string = (<HTMLInputElement>document.getElementById('glyph')).value;
    console.log(glyph);
    let ann = uniformBenchAnn(n/5, 100, 5, 5);
    let queryEnd = Math.max.apply(Math, ann.map(function(a) { return a.x + a.w; }));
    let maxY = Math.max.apply(Math, ann.map(function(a) { return a.y; }));

    let renderParams: BenchmarkRenderParams = {
        ann: ann,
        glyph: parseInt(glyph),
        queryStart: 0,
        queryEnd: queryEnd,
        maxY: maxY + 1,
    };

    chart.render(renderParams);
}

document.getElementById('submit')!.addEventListener('click', submit);
