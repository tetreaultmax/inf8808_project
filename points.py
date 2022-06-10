from main import *


def correlation_point(year):
    pbp = read_pbp(year)
    pbp = pbp[pbp["Game_Id"] < 30000]
    pbp = pbp[pbp["Event"] == 'GOAL']
    pbp = pbp.reset_index()
    ids = []
    set_ind = set()
    for i in range(1, 4):
        home_id = pbp[f"p{i}_ID"].values
        nan_home_id = np.isnan(home_id)
        not_nan_home = ~ nan_home_id
        home_id_not_nan = home_id[not_nan_home]
        set_ind.update(home_id_not_nan)
    for i in range(len(pbp)):
        player_ids = []
        for j in range(1, 4):
            player_ids.append(pbp[f"p{j}_ID"][i])
        ids.append(player_ids)
        print(player_ids)
    players2id = {p: i for i, p in enumerate(set_ind)}
    points_matrix = np.zeros((len(set_ind), len(set_ind)))
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

    return points_matrix
