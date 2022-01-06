function main() {
    let input_el = document.getElementById("input");
    let output_el = document.getElementById("output");
    let message_el = document.getElementById("message");
    let variable_labels = Array.from(document.querySelectorAll("label"));
    let variable_sliders = variable_labels.map(x => x.querySelector("input"));
    let variable_names = variable_labels.map(x => x.classList[0]);
    let v = {};

    variable_names.forEach((name, i) => {
        v[name] = variable_sliders[i];
    });

    function wrap_em(name, value) {
        // put numbers as subscript
        return `<span class="${name}"><em>${value}</em></span>`;
    }

    function update_input_output() {
        // input_el.innerHTML = `${wrap_em("w1", v.w1.value)}×
        //                       ${wrap_em("h1", v.h1.value)}×
        //                       ${wrap_em("d1", v.d1.value)}`;
        input_el.innerHTML = `${wrap_em("b", v.b.value)}×
                              ${wrap_em("c1", v.c1.value)}×
                              ${wrap_em("h1", v.h1.value)}×
                              ${wrap_em("w1", v.w1.value)}`;
        // Shape:
        // - Input: :math:`(N, C_{in}, H_{in}, W_{in})`
        // - Output: :math:`(N, C_{out}, H_{out}, W_{out})` where

        //   .. math::
        //       H_{out} = \left\lfloor\frac{H_{in}  + 2 \times \text{padding}[0] - \text{dilation}[0]
        //                 \times (\text{kernel\_size}[0] - 1) - 1}{\text{stride}[0]} + 1\right\rfloor

        //   .. math::
        //       W_{out} = \left\lfloor\frac{W_{in}  + 2 \times \text{padding}[1] - \text{dilation}[1]
        //                 \times (\text{kernel\_size}[1] - 1) - 1}{\text{stride}[1]} + 1\right\rfloor

        // only for suqare now
        var h2 = Math.floor( ( ( parseInt(v.h1.value) + 2 * v.p.value - v.d.value * ( v.k.value - 1 ) - 1 ) / v.s.value ) + 1 )
        var w2 = h2


        let message = "";
        if (w2 < 1 || h2 < 1)
        {
            message = "image size finally smaller than kernel size during the convolution";
        } else if (!Number.isInteger(w2) || !Number.isInteger(h2)) {
        }

        if (!Number.isInteger(w2) || w2 <= 0) {
            w2 = "❓";
        }
        if (!Number.isInteger(h2) || h2 <= 0) {
            h2 = "❓";
        }

        // output_el.innerHTML = `${wrap_em("w2", w2)}×
        //                       ${wrap_em("h2", h2)}×
        //                       ${wrap_em("k", v.k.value)}`;
        output_el.innerHTML = `${wrap_em("b", v.b.value)}×
                            ${wrap_em("c2", v.c2.value)}×
                            ${wrap_em("h2", h2)}×
                            ${wrap_em("w2", w2)}`;
        message_el.innerHTML = message;
    }

    variable_labels.forEach((label, i) => {
        let value_el = document.createElement("input");
        value_el.type = "number";
        value_el.classList.add("value");
        label.insertBefore(value_el, variable_sliders[i]);
        let slider_el = variable_sliders[i];
        let slider_update = () => {
            value_el.value = slider_el.value;
            update_input_output();
        };
        let ticker_update = () => {
            // if ticker exceeds slider max, slider adjusts
            if (parseInt(value_el.value) > parseInt(slider_el.max))
            {
                slider_el.max = parseInt(value_el.value);
            }
            slider_el.value = value_el.value;
            // if ticker exceeds slider min, ticker adjusts
            if (parseInt(value_el.value) < slider_el.value)
            {
                value_el.value = slider_el.value;
            }
            update_input_output();
        };
        slider_el.addEventListener("input", slider_update);
        value_el.addEventListener("input", ticker_update);
        slider_update();
    });
}
window.onload = main;
