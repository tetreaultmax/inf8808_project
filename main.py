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


def read_point(year):
    event_template = "stats/stats_" + str(year) + ".csv"
    df_event = pd.read_csv(f"{event_template}", quotechar='|')
    return df_event


def create_shot_file():
    shot_template = 'time_data.csv'
    header = ['year', 'shot', 'miss', 'block', 'goal', 'total']
    with open(f"{shot_template}", 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)


def create_shot_file():
    shot_template = 'shot_data.csv'
    header = ['year', 'shot', 'miss', 'block', 'goal', 'total']
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
    df.to_csv("time_dat/time_data_" + str(year) + ".csv", index=False)


def generate_time_data_files():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    for year in years:
        print(year)
        put_time_in_file(year)


def team_goals(year):
    pbp = read_pbp(year)
    pbp = pbp[pbp["Game_Id"] < 30000]
    pbp = pbp[pbp["Event"] == "GOAL"]
    pbp = pbp.reset_index()
    teams = list(set(pbp['Ev_Team']))
    goals_for = {key: 0 for key in teams}
    goals_against = {key: 0 for key in teams}
    for i in range(len(pbp["Event"])):
        goals_for[pbp['Ev_Team'][i]] += 1
        if pbp['Ev_Team'][i] == pbp['Home_Team'][i]:
            goals_against[pbp['Away_Team'][i]] += 1
        else:
            goals_against[pbp['Home_Team'][i]] += 1

    data = []
    for team in teams:
        data.append([team, goals_for[team], goals_against[team]])
    df = pd.DataFrame(data, columns=['team', 'goals_for', 'goals_against'])
    df.to_csv("team_goal/team_goal_data_" + str(year) + ".csv", index=False)


def create_teams_goal_files():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    for year in years:
        print(year)
        team_goals(year)


def points_leaders():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    all_name = []
    for year in years:
        df = read_point(year)
        names = df['Name'][:10]
        all_name.append(names)
    all_name = set(np.array(all_name).ravel())
    all_stat = []
    for name in all_name:
        for year in years:
            player_stat = [name, year, 0]
            df = read_point(year)
            for i in range(10):
                if name == df['Name'][i]:
                    player_stat[2] = df['P'][i]
                    break
            all_stat.append(player_stat)

    header = ['player', 'year', 'points']
    df = pd.DataFrame(all_stat, columns=header)
    df.to_csv("stats/all_stats_players_.csv", index=False)


def top_players():
    years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
    all_stats = []
    event_template = "stats/top_players.csv"
    df = pd.read_csv(f"{event_template}", quotechar='|')
    names = df['player']
    pos = 0
    for name in names:
        for year in years:
            all_stats.append([name, year, df[str(year)][pos]])
        pos += 1
    header = ['player', 'year', 'points']
    df = pd.DataFrame(all_stats, columns=header)
    df.to_csv("stats/top_players_year.csv", index=False)


# create_teams_goal_files()
top_players()
