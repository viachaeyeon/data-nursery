def get_(session, model, **kwargs):
    try:
        instance = (
            session.query(model)
            .filter_by(**kwargs)
            .first()
        )
        return instance
    except:
        return None

def get_or_create_(session, model, **kwargs):
    try:
        instance = (
            session.query(model)
            .filter_by(**kwargs)
            .order_by(model.created_at.desc())
            .first()
        )
        if instance:
            return instance
        else:
            instance = model(**kwargs)
            session.add(instance)
            session.commit()
            session.refresh(instance)
            return instance
    except:
        return None

def create_(session, model, **kwargs):
    try:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        session.refresh(instance)
        return instance
    except:
        return None