from main import *
from pathlib import Path  


def correlation_point(year, team):
    pbp = read_pbp(year)
    pbp = pbp[pbp["Game_Id"] < 30000]
    pbp = pbp[pbp["Event"] == 'GOAL']
    pbp = pbp[pbp["Ev_Team"] == team]
    pbp = pbp.reset_index()
    ids = []
    names = []
    all_name = []
    all_id = []
    set_ind = set()
    for i in range(len(pbp)):
        player_ids = []
        player_names = []
        for j in range(1, 4):
            name = pbp[f"p{j}_name"][i]
            player_id = pbp[f"p{j}_ID"][i]
            player_names.append(name)
            player_ids.append(player_id)
            if name not in all_name and name != 'nan':
                all_name.append(name)
                all_id.append(player_id)
        ids.append(player_ids)
        names.append(player_names)
    all_name = [x for x in all_name if str(x) != 'nan']
    all_id = [x for x in all_id if str(x) != 'nan']
    players2id = {p: i for i, p in enumerate(all_id)}
    points_matrix = np.zeros((len(all_id), len(all_id)))
    for i in range(len(ids)):
        if not pd.isnull(ids[i][0]):
            id1 = players2id[int(ids[i][0])]
            points_matrix[id1][id1] += 1
        if not pd.isnull(ids[i][1]):
            id2 = players2id[int(ids[i][1])]
            points_matrix[id1][id2] += 1
            points_matrix[id2][id1] += 1
            points_matrix[id2][id2] += 1
        if not pd.isnull(ids[i][2]):
            id3 = players2id[int(ids[i][2])]
            points_matrix[id1][id3] += 1
            points_matrix[id3][id1] += 1
            points_matrix[id1][id3] += 1
            points_matrix[id2][id1] += 1
            points_matrix[id1][id2] += 1

    return points_matrix, all_name

def stripMatrix(x, y):
    res = sorted(range(len(x.diagonal())), key = lambda sub: x.diagonal()[sub])[-5:]
    if(len(res) == 0): return False, 0 
    res_copy = res.copy()
    names = []
    for idx in res:
        names.append(y[idx])
    d = pd.DataFrame(np.zeros((5,5)))
    
    i = 0
    for index1 in res:    
        res_copy.remove(index1)
        j = i + 1
        for index2 in res_copy:
            d.iloc[i,j] = x[index1,index2]
            d.iloc[j,i] = x[index1,index2]
            j +=1
        i += 1
            
    d.columns = names
    d.index = names
    return True, d
    
    

x, y = correlation_point(2021, 'MTL')
z = stripMatrix(x,y)


YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
TEAM_NAMES = ['TOR','NSH','ANA','PHI','OTT','SEA','TBL','ARI','DET','LAK','STL','WSH','SJS','CAR','NYR','NYI','ATL','BOS','CBJ','EDM','NJD','CGY','VAN','COL','VGK','BUF','WPG','MTL','PIT','FLA','MIN','DAL','CHI']



for team in TEAM_NAMES:
    for year in YEARS:
        filepath = Path('points/' + str(year) + '/' + team + '.csv')  
        filepath.parent.mkdir(parents=True, exist_ok=True) 
        print(team + "  " + str(year))
        x,y = correlation_point(year, team)
        b, z = stripMatrix(x,y)
        if (b):
            z.to_csv(filepath)
