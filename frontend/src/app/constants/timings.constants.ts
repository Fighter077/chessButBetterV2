import { TimingOptions } from "../interfaces/game";

export const timings: TimingOptions = {
    'bullet': {
        'icon': 'push_pin',
        'options': [
            {
                'name': '1 min',
                'start': 60,
                'increment': 0
            },
            {
                'name': '1 | 1',
                'start': 60,
                'increment': 1
            },
            {
                'name': '2 | 1',
                'start': 120,
                'increment': 1
            }
        ]
    },
    'blitz': {
        'icon': 'electric_bolt',
        'options': [
            {
                'name': '3 min',
                'start': 180,
                'increment': 0
            },
            {
                'name': '3 | 2',
                'start': 180,
                'increment': 2
            },
            {
                'name': '5 min',
                'start': 300,
                'increment': 0
            }
        ]
    },
    'rapid': {
        'icon': 'timer',
        'options': [
            {
                'name': '10 min',
                'start': 600,
                'increment': 0
            },
            {
                'name': '15 | 10',
                'start': 900,
                'increment': 10
            },
            {
                'name': '30 min',
                'start': 1800,
                'increment': 0
            }
        ]
    }
}