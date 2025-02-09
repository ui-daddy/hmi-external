import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara'

const CustomPreset = definePreset(Lara, {
    semantic: {
        primary: {
            // 50: '{sky.50}',
            // 100: '{sky.100}',
            200: '#2196f3',
            // 300: '{sky.300}',
            // 400: '{sky.400}',
            500: '#2196f3',
            // 600: '{sky.600}',
            // 700: '{sky.700}',
            // 800: '{sky.800}',
            // 900: '{sky.900}',
            // 950: '{sky.950}'
        }
    },
    primitive: {
        orange: {
            500: '#FBC02D'
        }
    },
    components: {
        colorScheme: {
            light: {
                outlined: {
                    primary: {
                    //   hoverBackground: "{primary.50}",
                    //   activeBackground: "{primary.100}",
                    //   borderColor: "#2196f3",
                    //   color: "#2196f3"
                    },
                }
            }
        }
    }
});

export default CustomPreset;