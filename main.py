# Prétraitement des données
import csv

import numpy as np
import pandas as pd


def read_pbp(year):
    events_dir = "pbp/"
    event_template = "nhl_pbp" + str(year) + str(year + 1) + ".csv"
    df_event = pd.read_csv(f"{events_dir}{event_template}", quotechar='|')
    return df_event


def read_shifts(year):
    events_dir = "shifts/"
    event_template = "nhl_shifts" + str(year) + str(year + 1) + ".csv"
    df_event = pd.read_csv(f"{events_dir}{event_template}", quotechar='|')
    return df_event


def read_shot():
    event_template = "shot_data.csv"
    df_event = pd.read_csv(f"{event_template}", quotechar='|')
    return df_event


def create_shot_file():
    shot_template = 'time_data.csv'
    header = ['year', 'shot', 'miss', 'block', 'goal', 'total']
    with open(f"{shot_template}", 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)


def create_time_file():
    shot_template = 'shot_data.csv'
    header = ['name', 'id', 'mean_duration', 'mean_game', 'total', 'game_played']
    data = [
        [2007, 0, 0, 0, 0, 0, 0],
        [2008, 0, 0, 0, 0, 0, 0],
        [2009, 0, 0, 0, 0, 0, 0],
        [2010, 0, 0, 0, 0, 0, 0],
        [2011, 0, 0, 0, 0, 0, 0],
        [2012, 0, 0, 0, 0, 0, 0],
        [2013, 0, 0, 0, 0, 0, 0],
        [2014, 0, 0, 0, 0, 0, 0],
        [2015, 0, 0, 0, 0, 0, 0],
        [2016, 0, 0, 0, 0, 0, 0],
        [2017, 0, 0, 0, 0, 0, 0],
        [2018, 0, 0, 0, 0, 0, 0],
        [2019, 0, 0, 0, 0, 0, 0],
        [2020, 0, 0, 0, 0, 0, 0],
        [2021, 0, 0, 0, 0, 0, 0],
    ]
    with open(f"{shot_template}", 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(data)


def put_shot_in_file():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    shot = read_shot()
    for year in years:
        pbp = read_pbp(year)
        pbp = pbp[pbp["Game_Id"] < 30000]
        shoot = 0
        miss = 0
        block = 0
        goal = 0
        for event in pbp['Event'].values:
            print(year)
            if event == 'SHOT':
                shoot += 1
            elif event == 'MISS':
                miss += 1
            elif event == 'GOAL':
                goal += 1
            elif event == 'BLOCK':
                block += 1
        total = shoot + miss + goal + block
        shot.loc[year, 'shot'] = shoot
        shot.loc[year, 'miss'] = miss
        shot.loc[year, 'goal'] = goal
        shot.loc[year, 'block'] = block
        shot.loc[year, 'total'] = total
        shot.loc[year, 'year'] = year
    shot.to_csv("shot_data.csv", index=False)


# Create a set for all player id participating in all the events
def create_set_player_id(shifts):
    set_ind = set()
    set_name = set()
    for i in range(len(shifts['Player_Id'])):
        print(i)
        player_id = shifts['Player_Id'][i]
        name = shifts['Player'][i]
        set_ind.add(player_id)
        set_name.add(name)
    return [set_ind, set_name]


def put_time_in_file(year):
    shifts = read_shifts(year)
    shifts = shifts[shifts["Game_Id"] < 30000]
    shifts = shifts.dropna()
    ids = set(shifts['Player_Id'])
    ids = list(ids)
    data = []
    for i in range(len(ids)):
        print(i)
        shift_player = shifts.loc[shifts['Player_Id'] == ids[i]]
        shift_player = shift_player.reset_index()
        total_play = 0
        total_presence = 0
        nb_game = len(set(shift_player['Game_Id']))
        for j in range(len(shift_player['Player'])):
            total_play += shift_player['Duration'][j]
            total_presence += 1
        data.append([shift_player['Player'][0], ids[i], total_play / total_presence, (total_play / nb_game) / 60,
                     total_play / 60, nb_game])
    df = pd.DataFrame(data, columns=['name', 'id', 'mean_duration', 'mean_game', 'total', 'game_played'])
    df.to_csv("time_data_" + str(year) + ".csv", index=False)


def generate_time_data_files():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    for year in years:
        print(year)
        put_time_in_file(year)


generate_time_data_files()
